import type { Request, Response } from "express";
import { criarEvento as criarEventosService } from "../services/eventos.service.js";

export async function criarEvento(
  req: Request,
  res: Response
) {
  const receita = await criarEventosService(req.body);

  return res.status(201).json(receita);
}

export async function listarEventos(
  req: Request,
  res: Response
) {
  return res.status(200).json([]);
}

export async function buscarEvento(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarEvento(
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

export async function excluirEvento(
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