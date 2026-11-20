import type { Request, Response } from "express";

import {
  loginWithGoogle,
  linkGoogleAccount,
} from "../services/googleAuth.service.js";
import { nomeDispositivo } from "../services/sessao.service.js";

import {
  objectBody,
  text,
  password,
} from "../utils/validation.js";

import { HttpError } from "../utils/errors.js";

export async function googleLogin(
  req: Request,
  res: Response,
) {
  const body = objectBody(req.body);

  const idToken = text(
    body.idToken,
    "idToken",
    1,
    10000,
  );

  const result = await loginWithGoogle(
    idToken,
    body.maiorDeIdade === true && body.leuTermos === true,
    nomeDispositivo(req.get("user-agent"), body.plataforma),
  );

  res.status(200).json(result);
}

export async function linkGoogle(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(401, "Não autorizado.");
  }

  const body = objectBody(req.body);

  const user = await linkGoogleAccount(
    req.userId,

    text(
      body.idToken,
      "idToken",
      1,
      10000,
    ),

    password(body.currentPassword, false),
  );

  res.json({
    message: "Conta Google vinculada com sucesso.",
    user,
  });
}
