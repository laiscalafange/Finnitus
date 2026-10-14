import type { Request, Response } from "express";
import { criarMeta as criarMetaService } from "../services/meta.service.js";

export async function criarMeta(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const meta =
    await criarMetaService({
      ...req.body,
      id_Usuario: req.userId,
    });

  return res.status(201).json(meta);
}

export async function listarMetas(
  req: Request,
  res: Response
) {
  return res.status(200).json([]);
}

export async function buscarMeta(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarMeta(
  req: Request,
  res: Response
) {
  const id = req.params.id;
  const dados = req.body;

  return res.status(200).json({
    id,
    dados
  });
}

export async function excluirMeta(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    mensagem: "Meta excluída",
    id
  });
}

//req = requisicao res = resposta