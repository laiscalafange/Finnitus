
import type { Request, Response } from "express";

import {
  criarReservaFinanceira as criarReservaFinanceiraService,
  buscarReservaFinanceira as buscarReservaFinanceiraService,
  atualizarReservaFinanceira as atualizarReservaFinanceiraService,
  excluirReservaFinanceira as excluirReservaFinanceiraService,
} from "../services/reservaFinanceira.service.js";

export async function criarReservaFinanceira(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const reserva = await criarReservaFinanceiraService({
    ...req.body,
    id_Usuario: req.userId,
  });

  return res.status(201).json(reserva);
}

export async function buscarReservaFinanceira(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const reserva = await buscarReservaFinanceiraService(
    req.userId
  );

  if (!reserva) {
    return res.status(404).json({
      mensagem: "Reserva financeira não encontrada",
    });
  }

  return res.status(200).json(reserva);
}

export async function atualizarReservaFinanceira(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const reserva = await atualizarReservaFinanceiraService(
    req.userId,
    req.body
  );

  if (!reserva) {
    return res.status(404).json({
      mensagem: "Reserva financeira não encontrada",
    });
  }

  return res.status(200).json(reserva);
}

export async function excluirReservaFinanceira(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const reserva = await excluirReservaFinanceiraService(
    req.userId
  );

  if (!reserva) {
    return res.status(404).json({
      mensagem: "Reserva financeira não encontrada",
    });
  }

  return res.status(200).json({
    mensagem: "Reserva financeira excluída com sucesso",
  });
}
