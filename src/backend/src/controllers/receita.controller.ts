
import type { Request, Response } from "express";

import {
  criarReceita as criarReceitaService,
  listarReceitas as listarReceitasService,
  buscarReceita as buscarReceitaService,
  atualizarReceita as atualizarReceitaService,
  excluirReceita as excluirReceitaService,
} from "../services/receita.service.js";

export async function criarReceita(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const receita = await criarReceitaService({
    ...req.body,
    id_Usuario: req.userId,
  });

  return res.status(201).json(receita);
}

export async function listarReceitas(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const receitas = await listarReceitasService(req.userId);

  return res.status(200).json(receitas);
}

export async function buscarReceita(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID de receita inválido",
    });
  }

  const receita = await buscarReceitaService(id, req.userId);

  if (!receita) {
    return res.status(404).json({
      mensagem: "Receita não encontrada",
    });
  }

  return res.status(200).json(receita);
}

export async function atualizarReceita(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID de receita inválido",
    });
  }

  const receita = await atualizarReceitaService(
    id,
    req.userId,
    req.body
  );

  if (!receita) {
    return res.status(404).json({
      mensagem: "Receita não encontrada",
    });
  }

  return res.status(200).json(receita);
}

export async function excluirReceita(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID de receita inválido",
    });
  }

  const receita = await excluirReceitaService(id, req.userId);

  if (!receita) {
    return res.status(404).json({
      mensagem: "Receita não encontrada",
    });
  }

  return res.status(200).json({
    mensagem: "Receita excluída com sucesso",
    receita,
  });
}
