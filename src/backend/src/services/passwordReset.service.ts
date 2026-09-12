import { prisma } from "../lib/prisma.js";
import { generateResetToken } from "./token.service.js";

import {
  gerarCodigo,
  gerarHashCodigo,
  compararCodigo,
} from "../utils/passwordReset.js";

import { normalizeEmail } from "../utils/normalize.js";
import { sendPasswordResetCodeEmail } from "./emailService.js";

import bcrypt from "bcrypt";

// ======================================================
// SOLICITAR RECUPERAÇÃO DE SENHA
// ======================================================

export async function requestPasswordReset(
  email: string
): Promise<void> {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.usuario.findUnique({
    where: {
      Uemail: normalizedEmail,
    },
  });

  // Não revela se o e-mail existe ou não.
  if (!user) {
    return;
  }

  const codigo = gerarCodigo();

  const codigoHash = await gerarHashCodigo(
    codigo
  );

  // Código válido por 15 minutos.
  const expiraEm = new Date(
    Date.now() + 15 * 60 * 1000
  );

  // Invalida códigos anteriores ainda não utilizados.
  await prisma.redefinicaoSenha.updateMany({
    where: {
      id_Usuario: user.id_Usuario,
      usado: false,
    },

    data: {
      usado: true,
    },
  });

  // Cria uma nova solicitação de redefinição.
  await prisma.redefinicaoSenha.create({
    data: {
      id_Usuario: user.id_Usuario,
      codigo_hash: codigoHash,
      expira_em: expiraEm,
    },
  });

  // Envia o código para o e-mail cadastrado no banco.
  await sendPasswordResetCodeEmail(
    user.Uemail,
    codigo
  );
}

// ======================================================
// VERIFICAR CÓDIGO RECEBIDO POR E-MAIL
// ======================================================

export async function verifyResetCode(
  email: string,
  code: string
): Promise<string> {
  const invalidError = new Error(
    "Código inválido ou expirado"
  );

  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.usuario.findUnique({
    where: {
      Uemail: normalizedEmail,
    },
  });

  if (!user) {
    throw invalidError;
  }

  // Busca apenas uma redefinição:
  // - do usuário correto;
  // - ainda não utilizada;
  // - ainda não expirada;
  // - mais recente.
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

  if (!redefinicao) {
    throw invalidError;
  }

  // Compara o código digitado com o hash salvo.
  const codeMatches = await compararCodigo(
    code,
    redefinicao.codigo_hash
  );

  if (!codeMatches) {
    throw invalidError;
  }

  // IMPORTANTE:
  // não marcamos "usado = true" aqui.
  //
  // O código foi validado, mas a senha ainda não foi
  // realmente redefinida.
  //
  // A redefinição será marcada como usada somente
  // dentro de resetPassword().
  return generateResetToken(
    user.id_Usuario,
    redefinicao.id_Redefinicao
  );
}

// ======================================================
// REDEFINIR SENHA
// ======================================================

export async function resetPassword(
  userId: number,
  redefinicaoId: number,
  novaSenha: string
): Promise<void> {
  // Confirma novamente se a solicitação usada para
  // gerar o resetToken ainda é válida.
  const redefinicao =
    await prisma.redefinicaoSenha.findFirst({
      where: {
        id_Redefinicao: redefinicaoId,
        id_Usuario: userId,
        usado: false,

        expira_em: {
          gt: new Date(),
        },
      },
    });

  if (!redefinicao) {
    throw new Error(
      "Redefinição inválida ou expirada"
    );
  }

  // Gera o hash da nova senha.
  const senhaHash = await bcrypt.hash(
    novaSenha,
    10
  );

  // Atualiza a senha e invalida todas as solicitações
  // de redefinição ainda abertas do usuário.
  //
  // A transaction garante que as operações ocorram juntas.
  await prisma.$transaction([
    prisma.usuario.update({
      where: {
        id_Usuario: userId,
      },

      data: {
        Usenha: senhaHash,
      },
    }),

    prisma.redefinicaoSenha.updateMany({
      where: {
        id_Usuario: userId,
        usado: false,
      },

      data: {
        usado: true,
      },
    }),
  ]);
}