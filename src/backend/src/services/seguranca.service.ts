import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import type { Prisma, TipoDesafio2FA } from "../../generated/prisma/client.js";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";
import { invalidEmailSettings, sendEmail } from "./emailService.js";
import { criarSessao } from "./sessao.service.js";
import { safeSelect, safeUser } from "./user.service.js";

const MINUTO = 60_000;
const VALIDADE_CODIGO = 5 * MINUTO;
const MAX_TENTATIVAS = 5;

export type SessaoAtual = {
  userId: number;
  tokenVersion: number;
  sessaoId: string;
};

type DesafioEnviado = {
  id: string;
  codigo: string;
  email: string;
  tipo: TipoDesafio2FA;
};

function codigoInvalido() {
  return new HttpError(400, "Código inválido ou expirado. Confira o código ou solicite outro.");
}

function codigoHash(id: string, tipo: TipoDesafio2FA, codigo: string) {
  return createHmac("sha256", env.JWT_SECRET)
    .update(`finnitus:2fa:${id}:${tipo}:${codigo}`)
    .digest("hex");
}

async function bloquearUsuario(tx: Prisma.TransactionClient, userId: number, version: number) {
  // Serializa mudanças de senha, login e alterações de 2FA para a conta.
  const bloqueio = await tx.usuario.updateMany({
    where: { id_Usuario: userId, tokenVersion: version },
    data: { tokenVersion: { increment: 0 } },
  });
  if (bloqueio.count !== 1) return null;

  return tx.usuario.findUniqueOrThrow({
    where: { id_Usuario: userId },
    select: { ...safeSelect, duasEtapasAtiva: true },
  });
}

async function bloquearSessao(tx: Prisma.TransactionClient, sessao: SessaoAtual) {
  const { userId, tokenVersion, sessaoId } = sessao;
  const where = {
    id: sessaoId,
    id_Usuario: userId,
    tokenVersion,
    revogadaEm: null,
    expiraEm: { gt: new Date() },
  };
  const bloqueio = await tx.sessaoUsuario.updateMany({
    where, data: { tokenVersion: { increment: 0 } },
  });
  if (bloqueio.count !== 1) {
    throw new HttpError(401, "Sessão encerrada. Faça login novamente.");
  }
  return tx.sessaoUsuario.findUniqueOrThrow({ where: { id: sessaoId } });
}

async function criarDesafio(
  tx: Prisma.TransactionClient,
  userId: number,
  tokenVersion: number,
  email: string,
  tipo: TipoDesafio2FA,
  vinculo: { dispositivo: string } | { sessaoId: string },
): Promise<DesafioEnviado> {
  if (invalidEmailSettings().length > 0) {
    throw new HttpError(503, "Verificação por e-mail indisponível.");
  }

  const now = new Date();
  const filtro = { id_Usuario: userId, tipo };
  const anterior = await tx.desafio2FA.findFirst({
    where: { ...filtro, criadoEm: { gt: new Date(now.getTime() - MINUTO) } },
    select: { id: true },
  });
  if (anterior) throw new HttpError(429, "Aguarde um minuto antes de solicitar outro código.");

  await tx.desafio2FA.deleteMany({
    where: { id_Usuario: userId, expiraEm: { lte: now } },
  });
  await tx.desafio2FA.updateMany({
    where: { ...filtro, usadoEm: null },
    data: { usadoEm: now },
  });
  const id = randomUUID();
  const codigo = randomInt(0, 1_000_000).toString().padStart(6, "0");
  await tx.desafio2FA.create({
    data: {
      ...filtro,
      ...vinculo,
      id,
      tokenVersion,
      codigoHash: codigoHash(id, tipo, codigo),
      expiraEm: new Date(now.getTime() + VALIDADE_CODIGO),
    },
  });

  return { id, codigo, email, tipo };
}

async function enviarDesafio(desafio: DesafioEnviado) {
  const acoes: Record<TipoDesafio2FA, string> = {
    LOGIN: "entrar na sua conta",
    ATIVACAO: "ativar a verificação em duas etapas",
    DESATIVACAO: "desativar a verificação em duas etapas",
  };

  try {
    await sendEmail({
      to: desafio.email,
      subject: "Finnitus — Código de verificação",
      html: `<p>Use o código <strong>${desafio.codigo}</strong> para ${acoes[desafio.tipo]} no Finnitus.</p>
        <p>O código expira em 5 minutos. Se você não solicitou essa ação, ignore esta mensagem.</p>`,
    });
  } catch {
    await prisma.desafio2FA.updateMany({
      where: { id: desafio.id, usadoEm: null },
      data: { usadoEm: new Date() },
    });
    throw new HttpError(503, "Falha ao enviar o código de verificação.");
  }

  return { requires2FA: true as const, challengeId: desafio.id };
}

export async function concluirPrimeiraEtapa(
  userId: number,
  tokenVersion: number,
  dispositivo: string,
  isNewUser = false,
) {
  const resultado = await prisma.$transaction(async (tx) => {
    const user = await bloquearUsuario(tx, userId, tokenVersion);
    if (!user) throw new HttpError(401, "Entre novamente para continuar.");

    if (user.duasEtapasAtiva) {
      const desafio = await criarDesafio(tx, userId, tokenVersion, user.Uemail, "LOGIN", { dispositivo });
      return { desafio };
    }

    const token = await criarSessao(tx, userId, tokenVersion, dispositivo);
    return { sessao: { user: safeUser(user), token, isNewUser } };
  });

  return resultado.desafio ? enviarDesafio(resultado.desafio) : resultado.sessao;
}

async function consumirDesafio(
  tx: Prisma.TransactionClient,
  filtro: {
    id: string;
    id_Usuario: number;
    tokenVersion: number;
    tipo: TipoDesafio2FA;
    sessaoId: string | null;
  },
  codigo: string,
) {
  const now = new Date();
  const desafio = await tx.desafio2FA.findUnique({
    where: {
      ...filtro,
      usadoEm: null,
      expiraEm: { gt: now },
      tentativas: { lt: MAX_TENTATIVAS },
    },
  });
  if (!desafio) return null;

  const valido = timingSafeEqual(
    Buffer.from(desafio.codigoHash, "hex"),
    Buffer.from(codigoHash(desafio.id, desafio.tipo, codigo), "hex"),
  );
  const resultado = await tx.desafio2FA.updateMany({
    where: { id: desafio.id, usadoEm: null, expiraEm: { gt: now }, tentativas: desafio.tentativas },
    data: { tentativas: { increment: 1 }, ...(valido ? { usadoEm: now } : {}) },
  });

  return resultado.count === 1 && valido ? desafio : null;
}

export async function confirmarLogin(challengeId: string, codigo: string) {
  const desafio = await prisma.desafio2FA.findUnique({
    where: { id: challengeId, tipo: "LOGIN" },
    select: { id_Usuario: true, tokenVersion: true },
  });
  if (!desafio) throw codigoInvalido();

  const { id_Usuario: userId, tokenVersion } = desafio;
  const resultado = await prisma.$transaction(async (tx) => {
    const user = await bloquearUsuario(tx, userId, tokenVersion);
    if (!user?.duasEtapasAtiva) return null;

    const confirmado = await consumirDesafio(tx, {
      id: challengeId, id_Usuario: userId, tokenVersion, tipo: "LOGIN", sessaoId: null,
    }, codigo);
    if (!confirmado?.dispositivo) return null;

    const token = await criarSessao(tx, userId, tokenVersion, confirmado.dispositivo);
    return { user: safeUser(user), token };
  });
  if (!resultado) throw codigoInvalido();
  return resultado;
}

export async function configuracao2FA(userId: number) {
  const user = await prisma.usuario.findUnique({
    where: { id_Usuario: userId },
    select: { duasEtapasAtiva: true },
  });
  if (!user) throw new HttpError(401, "Usuário não encontrado.");
  return { ativa: user.duasEtapasAtiva, disponivel: invalidEmailSettings().length === 0 };
}

export async function solicitarAlteracao(sessao: SessaoAtual, ativar: boolean) {
  const { userId, tokenVersion, sessaoId } = sessao;
  const desafio = await prisma.$transaction(async (tx) => {
    const user = await bloquearUsuario(tx, userId, tokenVersion);
    if (!user) throw new HttpError(401, "Sessão encerrada. Faça login novamente.");
    await bloquearSessao(tx, sessao);
    if (user.duasEtapasAtiva === ativar) {
      throw new HttpError(400, ativar ? "A verificação já está ativa." : "A verificação já está desativada.");
    }

    return criarDesafio(tx, userId, tokenVersion, user.Uemail, ativar ? "ATIVACAO" : "DESATIVACAO", { sessaoId });
  });

  return enviarDesafio(desafio);
}

export async function confirmarAlteracao(
  sessao: SessaoAtual,
  challengeId: string,
  codigo: string,
  ativar: boolean,
) {
  const { userId, tokenVersion, sessaoId } = sessao;
  const resultado = await prisma.$transaction(async (tx) => {
    const user = await bloquearUsuario(tx, userId, tokenVersion);
    if (!user || user.duasEtapasAtiva === ativar) return null;
    const { dispositivo } = await bloquearSessao(tx, sessao);

    const confirmado = await consumirDesafio(tx, {
      id: challengeId, id_Usuario: userId, tokenVersion,
      tipo: ativar ? "ATIVACAO" : "DESATIVACAO", sessaoId,
    }, codigo);
    if (!confirmado) return null;

    await tx.usuario.update({
      where: { id_Usuario: userId },
      data: { duasEtapasAtiva: ativar, tokenVersion: { increment: 1 } },
    });
    const token = await criarSessao(tx, userId, tokenVersion + 1, dispositivo);
    return { ativa: ativar, user: safeUser(user), token };
  });
  if (!resultado) throw codigoInvalido();
  return resultado;
}
