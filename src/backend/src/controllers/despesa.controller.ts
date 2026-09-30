import type { Request, Response } from "express";
import { criarDespesa as criarDespesaService } from "../services/despesa.service.js";

export async function criarDespesa(
  req: Request,
  res: Response
) {
  const receita = await criarDespesaService(req.body);

  return res.status(201).json(receita);
}

export async function listarDespesas(
  req: Request,
  res: Response
) {
  return res.status(200).json([]);
}

export async function buscarDespesa(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarDespesa(
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

export async function excluirDespesa(
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