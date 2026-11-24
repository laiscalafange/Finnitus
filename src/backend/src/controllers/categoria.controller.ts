
import type { Request, Response } from "express";
import { listarCategorias as listarCategoriasService } from "../services/categoria.service.js";

export async function listarCategorias(
  req: Request,
  res: Response
) {
  const categorias = await listarCategoriasService();

  return res.status(200).json(categorias);
}
