import type {
  Request,
  Response,
} from "express";

import {
  buscarFotoPerfil,
  salvarFotoPerfil,
  removerFotoPerfil,
} from "../services/fotoPerfil.service.js";

import { HttpError } from "../utils/errors.js";

function obterIdUsuario(req: Request): number {
  if (!req.userId) {
    throw new HttpError(401, "Não autorizado.");
  }

  return req.userId;
}

export async function getFotoPerfil(
  req: Request,
  res: Response,
) {
  const fotoPerfilUrl = await buscarFotoPerfil(
    obterIdUsuario(req),
  );

  res.json({
    fotoPerfilUrl,
  });
}

export async function atualizarFotoPerfil(
  req: Request,
  res: Response,
) {
  if (!req.file) {
    throw new HttpError(
      400,
      "Selecione uma imagem para enviar.",
    );
  }

  const fotoPerfilUrl = await salvarFotoPerfil(
    obterIdUsuario(req),
    req.file.buffer,
  );

  res.json({
    message: "Foto de perfil atualizada com sucesso.",
    fotoPerfilUrl,
  });
}

export async function excluirFotoPerfil(
  req: Request,
  res: Response,
) {
  await removerFotoPerfil(obterIdUsuario(req));

  res.json({
    message: "Foto de perfil removida com sucesso.",
    fotoPerfilUrl: null,
  });
}