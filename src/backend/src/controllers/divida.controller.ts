
import type { Request, Response } from "express";

import {
  criarDivida as criarDividaService,
  listarDividas as listarDividasService,
  buscarDivida as buscarDividaService,
  atualizarDivida as atualizarDividaService,
  excluirDivida as excluirDividaService,
} from "../services/divida.service.js";

function idValido(id: string) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

export async function criarDivida(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const divida = await criarDividaService({
    ...req.body,
    id_Usuario: req.userId,
  });

  return res.status(201).json(divida);
}

export async function listarDividas(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const dividas = await listarDividasService(req.userId);

  return res.status(200).json(dividas);
}

export async function buscarDivida(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  if (
  typeof req.params.id !== "string" ||
  !idValido(req.params.id)
) {
    return res.status(400).json({
      mensagem: "ID de dívida inválido",
    });
  }

  const divida = await buscarDividaService(
    Number(req.params.id),
    req.userId,
  );

  if (!divida) {
    return res.status(404).json({
      mensagem: "Dívida não encontrada",
    });
  }

  return res.status(200).json(divida);
}

export async function atualizarDivida(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  if (
    typeof req.params.id !== "string" ||
    !idValido(req.params.id)
  ) {
    return res.status(400).json({
      mensagem: "ID de dívida inválido",
    });
  }

  const divida = await atualizarDividaService(
    Number(req.params.id),
    req.userId,
    req.body,
  );

  if (!divida) {
    return res.status(404).json({
      mensagem: "Dívida não encontrada",
    });
  }

  return res.status(200).json(divida);
}

export async function excluirDivida(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  if (
  typeof req.params.id !== "string" ||
  !idValido(req.params.id)
) {
    return res.status(400).json({
      mensagem: "ID de dívida inválido",
    });
  }

  const divida = await excluirDividaService(
    Number(req.params.id),
    req.userId,
  );

  if (!divida) {
    return res.status(404).json({
      mensagem: "Dívida não encontrada",
    });
  }

  return res.status(200).json({
    mensagem: "Dívida excluída com sucesso",
    divida,
  });
}
