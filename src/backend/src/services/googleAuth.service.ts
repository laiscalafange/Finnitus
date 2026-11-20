import bcrypt from "bcrypt";

import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

import {
  verifyGoogleIdentity,
} from "./googleIdentity.service.js";

import {
  safeUser,
  safeSelect,
} from "./user.service.js";

import { concluirPrimeiraEtapa } from "./seguranca.service.js";

function isUniqueConflict(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function loginWithGoogle(
  idToken: string,
  aceiteAdultoTermos: boolean,
  dispositivo: string,
) {
  // Importante: verificar ANTES de buscar um usuário existente.
  // Antes, contas Google já vinculadas entravam sem essa confirmação.
  if (!aceiteAdultoTermos) {
    throw new HttpError(
      400,
      "Confirme que tem 18 anos ou mais e que leu os documentos legais para continuar com Google."
    );
  }

  const identity = await verifyGoogleIdentity(idToken);

  // A identidade principal é o ID Google, não o e-mail.
  const linkedUser = await prisma.usuario.findUnique({
    where: {
      googleId: identity.googleId,
    },
  });

  if (linkedUser) {
    return concluirPrimeiraEtapa(linkedUser.id_Usuario, linkedUser.tokenVersion, dispositivo);
  }

  const sameEmail = await prisma.usuario.findUnique({
    where: {
      Uemail: identity.email,
    },
    select: {
      id_Usuario: true,
    },
  });

  if (sameEmail) {
    throw new HttpError(
      409,
      "Não foi possível criar o acesso Google para este e-mail. Entre pelo método já cadastrado e vincule o Google nas configurações.",
    );
  }

  if (!identity.emailAuthoritative) {
    throw new HttpError(
      400,
      "Para este provedor de e-mail, cadastre-se com e-mail e senha e depois vincule sua conta Google.",
    );
  }

  try {
    const user = await prisma.usuario.create({
      data: {
        googleId: identity.googleId,
        Unome: identity.name,
        Uemail: identity.email,
        Usenha: null,
        Utelefone: null,
        Udata_nasc: null,
        Udata_cadastro: new Date(),
        UTipo: "usuario",
      },
    });

    return concluirPrimeiraEtapa(user.id_Usuario, user.tokenVersion, dispositivo, true);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw new HttpError(
        409,
        "A conta foi criada ou vinculada em outra solicitação. Tente entrar novamente.",
      );
    }

    throw error;
  }
}

export async function linkGoogleAccount(
  userId: number,
  idToken: string,
  currentPassword: string,
) {
  const identity = await verifyGoogleIdentity(idToken);

  const user = await prisma.usuario.findUnique({
    where: {
      id_Usuario: userId,
    },
  });

  if (
    !user ||
    !user.Usenha ||
    !(await bcrypt.compare(currentPassword, user.Usenha))
  ) {
    throw new HttpError(400, "Senha atual incorreta.");
  }

  if (user.Uemail.trim().toLowerCase() !== identity.email) {
    throw new HttpError(
      400,
      "Escolha a conta Google com o mesmo e-mail cadastrado no Finnitus.",
    );
  }

  if (user.googleId === identity.googleId) {
    return safeUser(user);
  }

  if (user.googleId) {
    throw new HttpError(
      409,
      "Esta conta já está vinculada a outra identidade Google.",
    );
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const result = await tx.usuario.updateMany({
        where: {
          id_Usuario: userId,
          Usenha: user.Usenha,
          googleId: null,
        },
        data: {
          googleId: identity.googleId,
        },
      });

      if (result.count !== 1) {
        throw new HttpError(
          409,
          "A conta foi alterada em outra solicitação. Entre novamente e tente vincular.",
        );
      }

      const updated = await tx.usuario.findUniqueOrThrow({
        where: {
          id_Usuario: userId,
        },
        select: safeSelect,
      });

      return safeUser(updated);
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw new HttpError(
        409,
        "Esta identidade Google já está vinculada.",
      );
    }

    throw error;
  }
}
