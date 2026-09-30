import type { Request, Response } from "express";
import { criarReceita as criarReceitaService } from "../services/receita.service.js";

export async function criarReceita(
  req: Request,
  res: Response
) {
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

export async function listarReceitas(
  req: Request,
  res: Response
) {
  return res.status(200).json([]);
}

export async function buscarReceita(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarReceita(
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

export async function excluirReceita(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    mensagem: "Receita excluída",
    id
  });
}

//req = requisicao res = resposta