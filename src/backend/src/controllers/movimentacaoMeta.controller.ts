import type { Request, Response } from "express";
import { criarMovimentacaoMeta as criarMovimentacaoMetaService } from "../services/movimentacaoMeta.service.js";

export async function criarMovimentacaoMeta(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const movimentacaoMeta =
    await criarMovimentacaoMetaService({
      ...req.body,
      id_Usuario: req.userId,
    });

  return res.status(201).json(movimentacaoMeta);
}

export async function listarMovimentacoesMeta(
  req: Request,
  res: Response
) {
  return res.status(200).json([]);
}

export async function buscarMovimentacaoMeta(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarMovimentacaoMeta(
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

export async function excluirMovimentacaoMeta(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    mensagem: "Movimentação da meta excluída",
    id
  });
}

//req = requisicao res = resposta