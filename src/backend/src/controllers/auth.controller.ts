import type { Request, Response } from "express";

import {
  createUser,
  validateCredentials,
} from "../services/user.service.js";

import {
  verifyResetToken,
} from "../services/token.service.js";
import { concluirPrimeiraEtapa } from "../services/seguranca.service.js";
import { nomeDispositivo } from "../services/sessao.service.js";

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

// Mesmo controle no login e no cadastro: a proteção não depende do botão.
function exigirConfirmacoes(body: Record<string, unknown>): void {
  if (body.maiorDeIdade !== true || body.leuTermos !== true) {
    throw new HttpError(
      400,
      "Confirme que tem 18 anos ou mais e que leu os Termos e a Política de Privacidade."
    );
  }
}

export async function register(req: Request, res: Response) {
  const body = objectBody(req.body);
  exigirConfirmacoes(body);

  const user = await createUser({
    name: text(body.name, "name", 2, 100),
    email: emailValue(body.email),
    password: password(body.password),
  });

  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const body = objectBody(req.body);
  exigirConfirmacoes(body);

  const result = await validateCredentials(
    emailValue(body.email),
    password(body.password, false),
  );

  res.json(await concluirPrimeiraEtapa(
    result.user.id,
    result.tokenVersion,
    nomeDispositivo(req.get("user-agent"), body.plataforma),
  ));
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
    message: "Se o e-mail existir, um código de redefinição foi enviado.",
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
