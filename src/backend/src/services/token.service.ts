import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

interface ResetTokenPayload {
  sub: string;
  purpose: "reset-password";
  redefinicaoId: number;
}

export function generateResetToken(userId: number, redefinicaoId: number): string {
  return jwt.sign(
    { sub: String(userId), purpose: "reset-password", redefinicaoId },
    env.JWT_SECRET,
    { expiresIn: "10m" },
  );
}

export function verifyResetToken(token: string): { userId: number; redefinicaoId: number } {
  const payload = jwt.verify(token, env.JWT_SECRET) as ResetTokenPayload;

  if (payload.purpose !== "reset-password") {
    throw new Error("Token inválido");
  }

  return { userId: Number(payload.sub), redefinicaoId: payload.redefinicaoId };
}