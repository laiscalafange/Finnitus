import type { Request, Response } from "express";

import {
  getUserById,
  updateUser,
  changeUserPassword,
  deleteUser,
  logoutUser,
} from "../services/user.service.js";

import {
  objectBody,
  text,
  phone,
  birthDate,
  password,
} from "../utils/validation.js";

import { HttpError } from "../utils/errors.js";

function userId(req: Request) {
  if (!req.userId) {
    throw new HttpError(401, "Não autorizado.");
  }

  return req.userId;
}

export async function getMe(req: Request, res: Response) {
  res.json({
    user: await getUserById(userId(req)),
  });
}

export async function updateMe(req: Request, res: Response) {
  const body = objectBody(req.body);
  const keys = Object.keys(body);

  if (
    !keys.length ||
    keys.some(
      (key) => !["name", "telefone", "data_nasc"].includes(key),
    )
  ) {
    throw new HttpError(
      400,
      "Informe somente name, telefone e/ou data_nasc.",
    );
  }

  const data: {
    Unome?: string;
    Utelefone?: string;
    Udata_nasc?: Date;
  } = {};

  if (body.name !== undefined) {
    data.Unome = text(body.name, "name", 2, 100);
  }

  if (body.telefone !== undefined) {
    data.Utelefone = phone(body.telefone);
  }

  if (body.data_nasc !== undefined) {
    data.Udata_nasc = birthDate(body.data_nasc);
  }

  res.json({
    message: "Dados atualizados com sucesso.",
    user: await updateUser(userId(req), data),
  });
}

export async function changePassword(
  req: Request,
  res: Response,
) {
  const body = objectBody(req.body);

  await changeUserPassword(
    userId(req),
    password(body.currentPassword, false),
    password(body.newPassword),
  );

  res.json({
    message: "Senha alterada. Faça login novamente.",
    requiresLogin: true,
  });
}

export async function deleteMe(req: Request, res: Response) {
  const body = objectBody(req.body);

  if (body.confirm !== true) {
    throw new HttpError(
      400,
      "Confirme a exclusão com confirm: true.",
    );
  }

  await deleteUser(
    userId(req),
    password(body.currentPassword, false),
  );

  res.status(204).end();
}

export async function logout(req: Request, res: Response) {
  await logoutUser(userId(req));

  res.status(204).end();
}