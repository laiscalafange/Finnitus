import type {
  Request,
  Response,
} from "express";

import {
  confirmarEventoFinanceiro,
} from "../services/calendarioConfirmacao.service.js";

export async function confirmarEvento(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        mensagem:
          "Usuário não autenticado",
      });
    }

    const {
      idEventoExterno,
      tituloEvento,
      dataInicio,
      dataFim,
      diaInteiro,
      tipoMovimentacao,
      descricao,
      valor,
      data,
    } = req.body;

    if (
      !idEventoExterno ||
      !tituloEvento ||
      !dataInicio ||
      !tipoMovimentacao ||
      !descricao ||
      valor === undefined ||
      !data
    ) {
      return res.status(400).json({
        mensagem:
          "Dados obrigatórios ausentes.",
      });
    }

    if (
      tipoMovimentacao !==
        "RECEITA" &&
      tipoMovimentacao !==
        "DESPESA"
    ) {
      return res.status(400).json({
        mensagem:
          "Tipo de movimentação inválido.",
      });
    }

    const resultado =
      await confirmarEventoFinanceiro({
        id_Usuario:
          req.userId,

        idEventoExterno,

        tituloEvento,

        dataInicio,

        dataFim,

        diaInteiro,

        tipoMovimentacao,

        descricao,

        valor:
          Number(valor),

        data,
      });

    return res
      .status(201)
      .json(resultado);
  } catch (error) {
    console.error(
      "Erro ao confirmar evento financeiro:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "Este evento já foi processado."
    ) {
      return res.status(409).json({
        mensagem:
          error.message,
      });
    }

    return res.status(500).json({
      mensagem:
        "Erro ao confirmar movimentação.",
    });
  }
}