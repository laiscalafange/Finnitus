
import type { Request, Response } from "express";

import {
  criarMovimentacaoMeta as criarMovimentacaoMetaService,
  listarMovimentacoesMeta as listarMovimentacoesMetaService,
  buscarMovimentacaoMeta as buscarMovimentacaoMetaService,
  atualizarMovimentacaoMeta as atualizarMovimentacaoMetaService,
  excluirMovimentacaoMeta as excluirMovimentacaoMetaService,
} from "../services/movimentacaoMeta.service.js";

export async function criarMovimentacaoMeta(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const movimentacao = await criarMovimentacaoMetaService(
    req.body,
    req.userId
  );

  return res.status(201).json(movimentacao);
}

export async function listarMovimentacoesMeta(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const movimentacoes =
    await listarMovimentacoesMetaService(req.userId);

  return res.status(200).json(movimentacoes);
}

export async function buscarMovimentacaoMeta(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID da movimentação inválido",
    });
  }

  const movimentacao =
    await buscarMovimentacaoMetaService(id, req.userId);

  if (!movimentacao) {
    return res.status(404).json({
      mensagem: "Movimentação não encontrada",
    });
  }

  return res.status(200).json(movimentacao);
}

export async function atualizarMovimentacaoMeta(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID da movimentação inválido",
    });
  }

  const movimentacao =
    await atualizarMovimentacaoMetaService(
      id,
      req.userId,
      req.body
    );

  if (!movimentacao) {
    return res.status(404).json({
      mensagem: "Movimentação não encontrada",
    });
  }

  return res.status(200).json(movimentacao);
}

export async function excluirMovimentacaoMeta(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID da movimentação inválido",
    });
  }

  const movimentacao =
    await excluirMovimentacaoMetaService(id, req.userId);

  if (!movimentacao) {
    return res.status(404).json({
      mensagem: "Movimentação não encontrada",
    });
  }

  return res.status(200).json({
    mensagem: "Movimentação da meta excluída com sucesso",
  });
}
