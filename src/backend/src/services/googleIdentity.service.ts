import {
  OAuth2Client,
  type TokenPayload,
} from "google-auth-library";

import { env } from "../config/env.js";
import { HttpError } from "../utils/errors.js";

const googleClient = new OAuth2Client();

export interface GoogleIdentity {
  googleId: string;
  email: string;
  name: string;
  emailAuthoritative: boolean;
}

export async function verifyGoogleIdentity(
  idToken: string
): Promise<GoogleIdentity> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new HttpError(
      503,
      "Login Google ainda não configurado no servidor."
    );
  }

  let payload: TokenPayload | undefined;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } catch {
    throw new HttpError(
      401,
      "Não foi possível validar o login Google. Tente novamente."
    );
  }

  if (
    !payload ||
    !payload.sub ||
    payload.sub.length > 255 ||
    !payload.email ||
    payload.email_verified !== true
  ) {
    throw new HttpError(
      401,
      "A conta Google não forneceu uma identidade válida com e-mail verificado."
    );
  }

  const email = payload.email.trim().toLowerCase();

  if (email.length > 100) {
    throw new HttpError(
      400,
      "O e-mail excede o tamanho permitido pelo Finnitus."
    );
  }

  const name =
    payload.name?.trim().slice(0, 100) ||
    "Usuário Google";

  const emailAuthoritative =
    email.endsWith("@gmail.com") ||
    Boolean(payload.hd);

  return {
    googleId: payload.sub,
    email,
    name,
    emailAuthoritative,
  };
}