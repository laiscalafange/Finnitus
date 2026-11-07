// Importa os tipos Request e Response do Express.
// "import type" indica que eles são utilizados apenas para tipagem.
import type { Request, Response } from "express";

// Importa as funções responsáveis pelos cálculos financeiros.
import {
  obterResumoTelaInicial,
  obterDadosDashboard,
  type PeriodoFinanceiro,
} from "../services/gestaoFinanceira.service.js";

// Controla a resposta da tela inicial do aplicativo.
export async function buscarResumoTelaInicial(
  req: Request,
  res: Response,
): Promise<void> {
  // Recupera o ID definido pelo authMiddleware após validar o token.
  const id_Usuario = req.userId;

  // Impede a execução caso o usuário não esteja identificado.
  if (!id_Usuario) {
    res.status(401).json({
      mensagem: "Usuário não autenticado.",
    });
    return;
  }

  // Busca o resumo financeiro referente ao usuário autenticado.
  const resumo = await obterResumoTelaInicial(id_Usuario);

  // Retorna os dados financeiros no formato JSON.
  res.status(200).json(resumo);
}

// Controla a resposta da tela de dashboard.
export async function buscarDadosDashboard(
  req: Request,
  res: Response,
): Promise<void> {
  // Recupera o ID definido pelo middleware de autenticação.
  const id_Usuario = req.userId;

  // Impede a execução caso o usuário não esteja identificado.
  if (!id_Usuario) {
    res.status(401).json({
      mensagem: "Usuário não autenticado.",
    });
    return;
  }

  // Lê o período informado na URL.
  // Se nenhum período for informado, utiliza o mensal.
  const periodoInformado = req.query.periodo ?? "MENSAL";

  // Verifica se o período informado é permitido pelo service.
  const periodosPermitidos: PeriodoFinanceiro[] = [
    "DIARIO",
    "MENSAL",
    "ANUAL",
  ];

  if (
    typeof periodoInformado !== "string" ||
    !periodosPermitidos.includes(
      periodoInformado as PeriodoFinanceiro,
    )
  ) {
    res.status(400).json({
      mensagem: "Período inválido. Use DIARIO, MENSAL ou ANUAL.",
    });
    return;
  }

  // Lê a data de referência opcional enviada pela URL.
  const dataInformada = req.query.data;

  // A data precisa ser uma string quando for informada.
  if (
    dataInformada !== undefined &&
    typeof dataInformada !== "string"
  ) {
    res.status(400).json({
      mensagem: "Informe uma única data no formato AAAA-MM-DD.",
    });
    return;
  }

  // Busca os dados financeiros do usuário no período selecionado.
  // Quando a data não é informada, o service utiliza a data atual.
  const dados = await obterDadosDashboard(
    id_Usuario,
    periodoInformado as PeriodoFinanceiro,
    dataInformada,
  );

  // Retorna os dados do dashboard no formato JSON.
  res.status(200).json(dados);
}
