import type {
  Request,
  Response,
} from "express";

import {
  confirmarEventoFinanceiro,
  marcarEventoNaoFinanceiro,
} from "../services/calendarioConfirmacao.service.js";

/*
 * =====================================================
 * CONFIRMAR MOVIMENTAÇÃO
 * =====================================================
 */

export async function confirmarEvento(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error:
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
      !data
    ) {
      return res.status(400).json({
        error:
          "Dados obrigatórios não informados.",
      });
    }

    if (
      tipoMovimentacao !==
        "RECEITA" &&
      tipoMovimentacao !==
        "DESPESA"
    ) {
      return res.status(400).json({
        error:
          "Tipo de movimentação inválido.",
      });
    }

    const valorNumerico =
      Number(valor);

    if (
      !Number.isFinite(
        valorNumerico
      ) ||
      valorNumerico <= 0
    ) {
      return res.status(400).json({
        error:
          "Valor inválido.",
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
          valorNumerico,

        data,
      });

    return res
      .status(201)
      .json(resultado);
  } catch (error) {
    console.error("Falha ao confirmar evento", { tipo: error instanceof Error ? error.name : "unknown" });

    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro ao confirmar evento.";

    const status =
      mensagem.includes(
        "já foi processado"
      )
        ? 409
        : 500;

    return res.status(status).json({
      error: status === 409 ? "Este evento já foi classificado. Atualize a lista e tente novamente." : "Não foi possível processar o evento.",
    });
  }
}

/*
 * =====================================================
 * MARCAR COMO NÃO FINANCEIRO
 * =====================================================
 */

export async function marcarNaoFinanceiro(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error:
          "Usuário não autenticado",
      });
    }

    const {
      idEventoExterno,
      tituloEvento,
      dataInicio,
      dataFim,
      diaInteiro,
    } = req.body;

    if (
      !idEventoExterno ||
      !tituloEvento ||
      !dataInicio
    ) {
      return res.status(400).json({
        error:
          "Dados do evento não informados.",
      });
    }

    const evento =
      await marcarEventoNaoFinanceiro({
        id_Usuario:
          req.userId,

        idEventoExterno,

        tituloEvento,

        dataInicio,

        dataFim,

        diaInteiro,
      });

    return res.status(200).json({
      mensagem:
        "Evento marcado como não financeiro.",

      evento,
    });
  } catch (error) {
    console.error("Falha ao classificar evento", { tipo: error instanceof Error ? error.name : "unknown" });

    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro ao atualizar evento.";

    const status =
      mensagem.includes(
        "já foi confirmado"
      )
        ? 409
        : 500;

    return res.status(status).json({
      error: status === 409 ? "Este evento já foi classificado. Atualize a lista e tente novamente." : "Não foi possível processar o evento.",
    });
  }
}