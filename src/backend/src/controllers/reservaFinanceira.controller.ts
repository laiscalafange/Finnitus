import type { Request, Response } from "express";
import { criarReservaFinanceira as criarReservaFinanceiraService } from "../services/reservaFinanceira.service.js";

export async function criarReservaFinanceira(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const reservaFinanceira =
    await criarReservaFinanceiraService({
      ...req.body,
      id_Usuario: req.userId,
    });

  return res.status(201).json(reservaFinanceira);
}

export async function buscarReservaFinanceira(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarReservaFinanceira(
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

export async function excluirReservaFinanceira(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    mensagem: "Reserva financeira excluída",
    id
  });
}

//req = requisicao res = resposta