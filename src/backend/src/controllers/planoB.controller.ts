
import type { Request, Response } from "express";
import { analisarPlanoB } from "../services/planoB.service.js";

export async function analisarPlanoBController(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado.",
    });
  }

  // Os dados consolidados de receitas, despesas, dívidas e reserva serão
  // compartilhados com o provedor de IA; não executar sem aceite específico.
  if (req.body?.autorizarEnvioIA !== true) {
    return res.status(400).json({
      mensagem: "Para usar a análise com IA, autorize o envio dos dados financeiros resumidos ao provedor externo."
    });
  }
  const { imprevisto } = req.body ?? {};

  if (
    !imprevisto ||
    typeof imprevisto.Inome !== "string" ||
    !imprevisto.Inome.trim() ||
    !["PERDA_RENDA", "AUMENTO_DESPESA", "DESPESA_INESPERADA", "OUTRO"].includes(
      imprevisto.tipo
    ) ||
    !Number.isFinite(Number(imprevisto.Ivalor)) ||
    Number(imprevisto.Ivalor) <= 0 ||
    typeof imprevisto.Idata !== "string" ||
    Number.isNaN(Date.parse(imprevisto.Idata))
  ) {
    return res.status(400).json({
      mensagem: "Informe nome, tipo, valor positivo e data válida para o imprevisto.",
    });
  }

  try {
    const resultado = await analisarPlanoB(req.userId, {
      imprevisto: {
        Inome: imprevisto.Inome.trim(),
        tipo: imprevisto.tipo,
        Ivalor: Number(imprevisto.Ivalor),
        Idata: imprevisto.Idata,
        duracao_meses: imprevisto.duracao_meses,
        solucao_escolhida: imprevisto.solucao_escolhida,
        Idescricao: imprevisto.Idescricao,
      },
    });

    return res.status(200).json(resultado);
  } catch (erro) {
    console.error("Erro ao analisar Plano B:", erro);

    const erroApi = erro as { status?: number; statusCode?: number };
    const status = erroApi.status ?? erroApi.statusCode;

    if (status === 503) {
      return res.status(503).json({
        mensagem:
          "O serviço de análise está temporariamente indisponível. Tente novamente em alguns instantes.",
      });
    }

    return res.status(500).json({
      mensagem: "Não foi possível realizar a análise do Plano B.",
    });
  }
}
