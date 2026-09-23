import type { Request, Response } from "express";

import { criarCategoria as criarCategoriaService } from "../services/categoria.service.js";

export async function criarCategoria(
  req: Request,
  res: Response
) {
  const categoria = await criarCategoriaService(req.body);

  return res.status(201).json(categoria);
}
export async function listarCategorias(
  req: Request,
  res: Response
) {
  return res.status(200).json([]);
}

export async function buscarCategoria(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarCategoria(
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

export async function excluirCategoria(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    mensagem: "Categoria excluída",
    id
  });
}