import type { Request, Response } from "express";
import { criarDivida as criarDividaService } from "../services/divida.service.js";

export async function criarDivida(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const divida =
    await criarDividaService({
      ...req.body,
      id_Usuario: req.userId,
    });

  return res.status(201).json(divida);
}

export async function listarDividas(
  req: Request,
  res: Response
) {
  return res.status(200).json([]);
}

export async function buscarDivida(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarDivida(
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

export async function excluirDivida(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    mensagem: "Dívida excluída",
    id
  });
}

//req = requisicao res = resposta