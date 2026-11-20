import { createHash, randomUUID } from "node:crypto";
import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { generateToken, verifyAccessToken } from "./token.service.js";

export function nomeDispositivo(agente = "", plataforma?: unknown) {
  if (plataforma === "android" || /Android/i.test(agente)) return "Android";
  if (plataforma === "ios" || /iPhone|iPad|iOS/i.test(agente)) return "iPhone ou iPad";
  if (/Windows/i.test(agente)) return "Windows";
  if (/Macintosh|Mac OS/i.test(agente)) return "Mac";
  if (/Linux/i.test(agente)) return "Linux";
  return "Dispositivo desconhecido";
}

export async function criarSessao(
  tx: Prisma.TransactionClient,
  userId: number,
  tokenVersion: number,
  dispositivo: string,
) {
  const id = randomUUID();
  const token = generateToken(userId, tokenVersion, id);
  const { expiraEm } = verifyAccessToken(token);

  await tx.sessaoUsuario.deleteMany({
    where: { id_Usuario: userId, expiraEm: { lte: new Date() } },
  });
  await tx.sessaoUsuario.create({
    data: { id, id_Usuario: userId, tokenVersion, dispositivo, expiraEm },
  });
  return token;
}

export async function verificarSessao(
  token: string,
  payload: ReturnType<typeof verifyAccessToken>,
  agente?: string,
) {
  const { userId, tokenVersion, sessaoId, expiraEm, criadaEm } = payload;
  // Tokens emitidos antes da migração não possuem jti. O identificador
  // determinístico mantém a revogação desse token até seu vencimento.
  const id = sessaoId ?? `legacy-${createHash("sha256").update(token).digest("hex")}`;
  const where = { id, id_Usuario: userId, tokenVersion };
  let sessao = await prisma.sessaoUsuario.findUnique({
    where,
    select: { expiraEm: true, revogadaEm: true },
  });

  if (!sessao && !sessaoId) {
    await prisma.sessaoUsuario.createMany({
      data: {
        ...where,
        dispositivo: nomeDispositivo(agente),
        criadaEm,
        expiraEm,
      },
      skipDuplicates: true,
    });
    sessao = await prisma.sessaoUsuario.findUnique({
      where,
      select: { expiraEm: true, revogadaEm: true },
    });
  }

  return sessao && !sessao.revogadaEm && sessao.expiraEm > new Date() ? id : null;
}

export async function listarSessoes(userId: number, tokenVersion: number, sessaoId: string) {
  const sessoes = await prisma.sessaoUsuario.findMany({
    where: {
      id_Usuario: userId,
      tokenVersion,
      revogadaEm: null,
      expiraEm: { gt: new Date() },
    },
    select: { id: true, dispositivo: true, criadaEm: true },
    orderBy: { criadaEm: "desc" },
  });

  return sessoes.map((sessao) => ({ ...sessao, atual: sessao.id === sessaoId }));
}

export async function revogarSessao(userId: number, tokenVersion: number, sessaoId: string) {
  await prisma.sessaoUsuario.updateMany({
    where: { id: sessaoId, id_Usuario: userId, tokenVersion, revogadaEm: null },
    data: { revogadaEm: new Date() },
  });
}
