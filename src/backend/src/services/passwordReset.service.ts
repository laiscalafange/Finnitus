import { prisma } from "../lib/prisma.js";
import { generateResetToken } from "./token.service.js";
import {
  gerarCodigo,
  gerarHashCodigo,
  compararCodigo,
} from "../utils/passwordReset.js";
import { sendPasswordResetCodeEmail } from "./emailService.js";

export async function requestPasswordReset(
  email: string
): Promise<void> {
  const user = await prisma.usuario.findUnique({
    where: { Uemail: email },
  });

  // Não revela se o e-mail existe
  if (!user) return;

  const codigo = gerarCodigo();
  const codigoHash = await gerarHashCodigo(codigo);

  const expiraEm = new Date(
    Date.now() + 15 * 60 * 1000
  );

  await prisma.redefinicaoSenha.create({
    data: {
      id_Usuario: user.id_Usuario,
      codigo_hash: codigoHash,
      expira_em: expiraEm,
    },
  });

  await sendPasswordResetCodeEmail(
    user.Uemail,
    codigo
  );
}

export async function verifyResetCode(
  email: string,
  code: string
): Promise<string> {
  const invalidError = new Error(
    "Código inválido ou expirado"
  );

  const user = await prisma.usuario.findUnique({
    where: { Uemail: email },
  });

  if (!user) throw invalidError;

  const redefinicao =
    await prisma.redefinicaoSenha.findFirst({
      where: {
        id_Usuario: user.id_Usuario,
        usado: false,
        expira_em: {
          gt: new Date(),
        },
      },
      orderBy: {
        criado_em: "desc",
      },
    });

  if (!redefinicao) throw invalidError;

  const codeMatches = await compararCodigo(
    code,
    redefinicao.codigo_hash
  );

  if (!codeMatches) throw invalidError;

  await prisma.redefinicaoSenha.update({
    where: {
      id_Redefinicao: redefinicao.id_Redefinicao,
    },
    data: {
      usado: true,
    },
  });

  return generateResetToken(
    user.id_Usuario,
    redefinicao.id_Redefinicao
  );
}

export async function resetPassword(
  userId: number,
  novaSenha: string
): Promise<void> {
  // Mantemos bcrypt aqui porque essa é a senha REAL do usuário.
  const bcrypt = await import("bcrypt");

  const senhaHash = await bcrypt.hash(
    novaSenha,
    10
  );

  await prisma.usuario.update({
    where: {
      id_Usuario: userId,
    },
    data: {
      Usenha: senhaHash,
    },
  });
}