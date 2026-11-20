import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/errors.js";

const issuer = "finnitus-api";

function verify(
  token: string,
  audience: string,
  purpose: string,
): jwt.JwtPayload & { exp: number } {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer,
      audience,
    });

    if (
      typeof payload === "string" ||
      payload.purpose !== purpose ||
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub) ||
      !Number.isSafeInteger(Number(payload.sub)) ||
      Number(payload.sub) > 2147483647 ||
      typeof payload.exp !== "number"
    ) {
      throw new Error();
    }

    return { ...payload, exp: payload.exp };
  } catch {
    throw new HttpError(401, "Token inválido ou expirado.");
  }
}

export function generateToken(
  userId: number,
  tokenVersion: number,
  sessaoId: string,
): string {
  return jwt.sign(
    {
      purpose: "access",
      tokenVersion,
    },
    env.JWT_SECRET,
    {
      algorithm: "HS256",
      subject: String(userId),
      issuer,
      audience: "finnitus-app",
      jwtid: sessaoId,
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    },
  );
}

export function verifyAccessToken(token: string) {
  const payload = verify(token, "finnitus-app", "access");

  if (
    !Number.isSafeInteger(payload.tokenVersion) ||
    payload.tokenVersion < 0
  ) {
    throw new HttpError(401, "Token inválido.");
  }

  return {
    userId: Number(payload.sub),
    tokenVersion: payload.tokenVersion as number,
    sessaoId: payload.jti,
    criadaEm: payload.iat === undefined ? undefined : new Date(payload.iat * 1000),
    expiraEm: new Date(payload.exp * 1000),
  };
}

export function generateResetToken(
  userId: number,
  redefinicaoId: number,
): string {
  return jwt.sign(
    {
      purpose: "reset-password",
      redefinicaoId,
    },
    env.JWT_SECRET,
    {
      algorithm: "HS256",
      subject: String(userId),
      issuer,
      audience: "finnitus-reset",
      expiresIn: "10m",
    },
  );
}

export function verifyResetToken(token: string) {
  const payload = verify(
    token,
    "finnitus-reset",
    "reset-password",
  );

  if (
    !Number.isSafeInteger(payload.redefinicaoId) ||
    payload.redefinicaoId < 1 ||
    payload.redefinicaoId > 2147483647
  ) {
    throw new HttpError(401, "Token inválido.");
  }

  return {
    userId: Number(payload.sub),
    redefinicaoId: payload.redefinicaoId as number,
  };
}
