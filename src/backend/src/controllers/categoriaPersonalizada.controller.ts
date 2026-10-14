import type { Request, Response } from "express";
import { criarCategoriaPersonalizada as criarCategoriaPersonalizadaService } from "../services/categoriaPersonalizada.service.js";

export async function criarCategoriaPersonalizada(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const categoriaPersonalizada   =
    await criarCategoriaPersonalizadaService({
      ...req.body,
      id_Usuario: req.userId,
    });

  return res.status(201).json(categoriaPersonalizada);
}

export async function listarCategoriasPersonalizadas(
  req: Request,
  res: Response
) {
  return res.status(200).json([]);
}

export async function buscarCategoriaPersonalizada(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarCategoriaPersonalizada(
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

export async function excluirCategoriaPersonalizada(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    mensagem: "Categoria personalizada excluída",
    id
  });
}

//req = requisicao res = resposta