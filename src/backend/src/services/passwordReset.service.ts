import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { generateResetToken } from "./token.service.js";

const CODE_LENGTH = 6;
const CODE_EXPIRATION_MINUTES = 15;

function generateCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(CODE_LENGTH, "0");
}

export async function requestPasswordReset(email: string): Promise<void> {
  const user = await prisma.usuario.findUnique({ where: { Uemail: email } });

  // Não revela se o e-mail existe (evita enumeração)
  if (!user) return;

  const code = generateCode();
  const codigoHash = await bcrypt.hash(code, 10);
  const expiraEm = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000);

  await prisma.redefinicaoSenha.create({
    data: { id_Usuario: user.id_Usuario, codigo_hash: codigoHash, expira_em: expiraEm },
  });

  // TODO(Fase 6): trocar por envio real via Nodemailer quando o Gmail estiver pronto
  console.log(`[DEV] Código de redefinição para ${email}: ${code}`);
}

export async function verifyResetCode(email: string, code: string): Promise<string> {
  const invalidError = new Error("Código inválido ou expirado");
  const user = await prisma.usuario.findUnique({ where: { Uemail: email } });
  if (!user) throw invalidError;

  const redefinicao = await prisma.redefinicaoSenha.findFirst({
    where: { id_Usuario: user.id_Usuario, usado: false, expira_em: { gt: new Date() } },
    orderBy: { criado_em: "desc" },
  });
  if (!redefinicao) throw invalidError;

  const codeMatches = await bcrypt.compare(code, redefinicao.codigo_hash);
  if (!codeMatches) throw invalidError;

  // uso único: o código não serve mais depois disso
  await prisma.redefinicaoSenha.update({
    where: { id_Redefinicao: redefinicao.id_Redefinicao },
    data: { usado: true },
  });

  return generateResetToken(user.id_Usuario, redefinicao.id_Redefinicao);
}

export async function resetPassword(userId: number, novaSenha: string): Promise<void> {
  const senhaHash = await bcrypt.hash(novaSenha, 10);
  await prisma.usuario.update({ where: { id_Usuario: userId }, data: { Usenha: senhaHash } });
}