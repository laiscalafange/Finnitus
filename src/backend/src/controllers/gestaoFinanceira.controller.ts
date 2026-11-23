
import type { Request, Response } from "express";

import {
  obterResumoTelaInicial,
  obterDashboardCompleto,
  type PeriodoDashboard,
} from "../services/gestaoFinanceira.service.js";

// Resumo financeiro da tela inicial.
export async function buscarResumoTelaInicial(
  req: Request,
  res: Response,
): Promise<void> {
  const id_Usuario = req.userId;

  if (!id_Usuario) {
    res.status(401).json({
      mensagem: "Usuário não autenticado.",
    });
    return;
  }

  const resumo = await obterResumoTelaInicial(id_Usuario);

  res.status(200).json(resumo);
}

// Dados completos do dashboard.
export async function buscarDadosDashboard(
  req: Request,
  res: Response,
): Promise<void> {
  const id_Usuario = req.userId;

  if (!id_Usuario) {
    res.status(401).json({
      mensagem: "Usuário não autenticado.",
    });
    return;
  }

  const periodoInformado = req.query.periodo ?? "MENSAL";

  const periodosPermitidos: PeriodoDashboard[] = [
    "SEMANAL",
    "MENSAL",
  ];

  if (
    typeof periodoInformado !== "string" ||
    !periodosPermitidos.includes(
      periodoInformado as PeriodoDashboard,
    )
  ) {
    res.status(400).json({
      mensagem: "Período inválido. Utilize SEMANAL ou MENSAL.",
    });
    return;
  }

  const dataInformada = req.query.data;

  if (
    dataInformada !== undefined &&
    typeof dataInformada !== "string"
  ) {
    res.status(400).json({
      mensagem: "Informe uma única data no formato AAAA-MM-DD.",
    });
    return;
  }

  const dados = await obterDashboardCompleto(
    id_Usuario,
    periodoInformado as PeriodoDashboard,
    dataInformada,
  );

  res.status(200).json(dados);
}
