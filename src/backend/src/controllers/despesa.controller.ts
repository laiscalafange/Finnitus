
import type { Request, Response } from "express";

import {
  criarDespesa as criarDespesaService,
  listarDespesas as listarDespesasService,
  buscarDespesa as buscarDespesaService,
  atualizarDespesa as atualizarDespesaService,
  excluirDespesa as excluirDespesaService,
} from "../services/despesa.service.js";

export async function criarDespesa(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const despesa = await criarDespesaService({
    ...req.body,
    id_Usuario: req.userId,
  });

  return res.status(201).json(despesa);
}

export async function listarDespesas(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const despesas = await listarDespesasService(req.userId);

  return res.status(200).json(despesas);
}

export async function buscarDespesa(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID de despesa inválido",
    });
  }

  const despesa = await buscarDespesaService(id, req.userId);

  if (!despesa) {
    return res.status(404).json({
      mensagem: "Despesa não encontrada",
    });
  }

  return res.status(200).json(despesa);
}

export async function atualizarDespesa(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID de despesa inválido",
    });
  }

  const despesa = await atualizarDespesaService(
    id,
    req.userId,
    req.body
  );

  if (!despesa) {
    return res.status(404).json({
      mensagem: "Despesa não encontrada",
    });
  }

  return res.status(200).json(despesa);
}

export async function excluirDespesa(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID de despesa inválido",
    });
  }

  const despesa = await excluirDespesaService(id, req.userId);

  if (!despesa) {
    return res.status(404).json({
      mensagem: "Despesa não encontrada",
    });
  }

  return res.status(200).json({
    mensagem: "Despesa excluída com sucesso",
    despesa,
  });
}
