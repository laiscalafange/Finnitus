import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { generateResetToken } from "./token.service.js";

import {
  gerarCodigo,
  gerarHashCodigo,
  compararCodigo,
} from "../utils/passwordReset.js";

import { sendPasswordResetCodeEmail } from "./emailService.js";
import { HttpError } from "../utils/errors.js";

const invalid = () =>
  new HttpError(
    400,
    "Código ou redefinição inválida ou expirada.",
  );

export async function requestPasswordReset(email: string) {
  const user = await prisma.usuario.findUnique({
    where: {
      Uemail: email,
    },
  });

  if (!user) return;

  const code = gerarCodigo();
  const hash = await gerarHashCodigo(code);

  const id = await prisma.$transaction(async (tx) => {
    // Bloqueia a linha para organizar pedidos simultâneos.
    // Incrementar zero mantém a versão atual da sessão.
    await tx.usuario.update({
      where: {
        id_Usuario: user.id_Usuario,
      },
      data: {
        tokenVersion: {
          increment: 0,
        },
      },
    });

    const recent = await tx.redefinicaoSenha.findFirst({
      where: {
        id_Usuario: user.id_Usuario,
        criado_em: {
          gt: new Date(Date.now() - 60000),
        },
      },
    });

    // Um novo pedido por minuto por conta.
    if (recent) return null;

    await tx.redefinicaoSenha.updateMany({
      where: {
        id_Usuario: user.id_Usuario,
        usado: false,
      },
      data: {
        usado: true,
      },
    });

    const row = await tx.redefinicaoSenha.create({
      data: {
        id_Usuario: user.id_Usuario,
        codigo_hash: hash,
        expira_em: new Date(Date.now() + 15 * 60000),
      },
    });

    return row.id_Redefinicao;
  });

  if (id === null) return;

  try {
    await sendPasswordResetCodeEmail(user.Uemail, code);
  } catch (error) {
    await prisma.redefinicaoSenha.update({
      where: {
        id_Redefinicao: id,
      },
      data: {
        usado: true,
      },
    });

    throw error;
  }
}

export async function verifyResetCode(
  email: string,
  code: string,
) {
  const user = await prisma.usuario.findUnique({
    where: {
      Uemail: email,
    },
  });

  if (!user) throw invalid();

  const row = await prisma.redefinicaoSenha.findFirst({
    where: {
      id_Usuario: user.id_Usuario,
      usado: false,
      verificado: false,
      tentativas: {
        lt: 5,
      },
      expira_em: {
        gt: new Date(),
      },
    },
    orderBy: [
      { criado_em: "desc" },
      { id_Redefinicao: "desc" },
    ],
  });

  if (!row) throw invalid();

  // Conta a tentativa antes da comparação do hash.
  const attempt = await prisma.redefinicaoSenha.updateMany({
    where: {
      id_Redefinicao: row.id_Redefinicao,
      usado: false,
      verificado: false,
      tentativas: {
        lt: 5,
      },
      expira_em: {
        gt: new Date(),
      },
    },
    data: {
      tentativas: {
        increment: 1,
      },
    },
  });

  if (
    attempt.count !== 1 ||
    !(await compararCodigo(code, row.codigo_hash))
  ) {
    throw invalid();
  }

  const token = generateResetToken(
    user.id_Usuario,
    row.id_Redefinicao,
  );

  const claimed = await prisma.redefinicaoSenha.updateMany({
    where: {
      id_Redefinicao: row.id_Redefinicao,
      usado: false,
      verificado: false,
      expira_em: {
        gt: new Date(),
      },
    },
    data: {
      verificado: true,
    },
  });

  if (claimed.count !== 1) throw invalid();

  return token;
}

export async function resetPassword(
  userId: number,
  redefinicaoId: number,
  novaSenha: string,
) {
  const hash = await bcrypt.hash(novaSenha, 12);

  await prisma.$transaction(async (tx) => {
    // Mantém a ordem de bloqueio usada pelos outros fluxos:
    // primeiro usuário, depois redefinição.
    const user = await tx.usuario.updateMany({
      where: {
        id_Usuario: userId,
      },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });

    if (user.count !== 1) throw invalid();

    const claimed = await tx.redefinicaoSenha.updateMany({
      where: {
        id_Redefinicao: redefinicaoId,
        id_Usuario: userId,
        usado: false,
        verificado: true,
        expira_em: {
          gt: new Date(),
        },
      },
      data: {
        usado: true,
      },
    });

    if (claimed.count !== 1) {
      // O erro também desfaz o incremento da versão.
      throw invalid();
    }

    await tx.usuario.update({
      where: {
        id_Usuario: userId,
      },
      data: {
        Usenha: hash,
      },
    });

    await tx.redefinicaoSenha.updateMany({
      where: {
        id_Usuario: userId,
        usado: false,
      },
      data: {
        usado: true,
      },
    });
  });
}