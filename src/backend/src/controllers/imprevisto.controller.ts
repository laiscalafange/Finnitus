import type { Request, Response } from "express";
import { criarImprevisto as criarImprevistoService } from "../services/imprevisto.service.js";

export async function criarImprevisto(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const imprevisto =
    await criarImprevistoService({
      ...req.body,
      id_Usuario: req.userId,
    });

  return res.status(201).json(imprevisto);
}

export async function listarImprevistos(
  req: Request,
  res: Response
) {
  return res.status(200).json([]);
}

export async function buscarImprevisto(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarImprevisto(
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

export async function excluirImprevisto(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    mensagem: "Imprevisto excluído",
    id
  });
}

//req = requisicao res = resposta