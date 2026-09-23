import type { Request, Response } from "express";

import {
  createUser,
  validateCredentials,
} from "../services/user.service.js";

import {
  generateToken,
  verifyResetToken,
} from "../services/token.service.js";

import {
  requestPasswordReset,
  verifyResetCode,
  resetPassword as reset,
} from "../services/passwordReset.service.js";

import {
  objectBody,
  text,
  emailValue,
  password,
} from "../utils/validation.js";

import { HttpError } from "../utils/errors.js";

export async function register(req: Request, res: Response) {
  const body = objectBody(req.body);

  const user = await createUser({
    name: text(body.name, "name", 2, 100),
    email: emailValue(body.email),
    password: password(body.password),
  });

  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const body = objectBody(req.body);

  const result = await validateCredentials(
    emailValue(body.email),
    password(body.password, false),
  );

  res.json({
    user: result.user,
    token: generateToken(
      result.user.id,
      result.tokenVersion,
    ),
  });
}

export async function forgotPassword(
  req: Request,
  res: Response,
) {
  const email = emailValue(objectBody(req.body).email);

  try {
    await requestPasswordReset(email);
  } catch {
    console.error(
      "Falha ao processar recuperação. Verifique o banco e o SMTP.",
    );
  }

  // Resposta genérica, inclusive se o envio falhar.
  res.json({
    message:
      "Se o e-mail existir, um código de redefinição foi enviado.",
  });
}

export async function verifyCode(
  req: Request,
  res: Response,
) {
  const body = objectBody(req.body);
  const email = emailValue(body.email);
  const code = text(body.code, "code", 4, 4);

  if (!/^\d{4}$/.test(code)) {
    throw new HttpError(
      400,
      "Informe os 4 dígitos do código.",
    );
  }

  res.json({
    resetToken: await verifyResetCode(email, code),
  });
}

export async function resetPassword(
  req: Request,
  res: Response,
) {
  const body = objectBody(req.body);
  const newPassword = password(body.newPassword);

  const payload = verifyResetToken(
    text(body.resetToken, "resetToken", 1, 2048),
  );

  await reset(
    payload.userId,
    payload.redefinicaoId,
    newPassword,
  );

  res.json({
    message: "Senha redefinida. Faça login novamente.",
  });
}