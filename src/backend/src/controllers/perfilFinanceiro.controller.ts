
import type { Request, Response } from "express";

import {
  salvarPerfilFinanceiro,
  atualizarReservaFinanceira,
  buscarPerfilFinanceiro,
} from "../services/perfilFinanceiro.service.js";

import { HttpError } from "../utils/errors.js";
import { objectBody } from "../utils/validation.js";

// Salva os dados da tela FinancialData.
export async function salvarPerfil(
  req: Request,
  res: Response
): Promise<void> {
  const idUsuario = req.userId;

  if (!idUsuario) {
    throw new HttpError(401, "Usuário não autenticado.");
  }

  const { renda_fixa, renda_variavel, despesas_mensais } = objectBody(req.body);

  const perfil = await salvarPerfilFinanceiro(idUsuario, {
    renda_fixa,
    renda_variavel,
    despesas_mensais,
  });

  res.status(200).json({
    message: "Perfil financeiro salvo com sucesso.",
    perfil,
  });
}

// Salva os dados da tela FutureSavings.
export async function salvarReserva(
  req: Request,
  res: Response
): Promise<void> {
  const idUsuario = req.userId;

  if (!idUsuario) {
    throw new HttpError(401, "Usuário não autenticado.");
  }

  const { economia_futura, tempo_economia } = objectBody(req.body);

  const perfil = await atualizarReservaFinanceira(idUsuario, {
    economia_futura,
    tempo_economia,
  });

  res.status(200).json({
    message: "Reserva de emergência salva com sucesso.",
    perfil,
  });
}

// Consulta os dados financeiros do usuário.
export async function buscarPerfil(
  req: Request,
  res: Response
): Promise<void> {
  const idUsuario = req.userId;

  if (!idUsuario) {
    throw new HttpError(401, "Usuário não autenticado.");
  }

  const perfil = await buscarPerfilFinanceiro(idUsuario);

  res.status(200).json({ perfil });
}
