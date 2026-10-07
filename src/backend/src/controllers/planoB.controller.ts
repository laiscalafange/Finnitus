import type { Request, Response } from "express";
import { analisarPlanoB } from "../services/planoB.service.js";

export async function analisarPlanoBController(
  req: Request,
  res: Response
) {
  try {
    const resultado = await analisarPlanoB(req.body);

    return res.status(200).json(resultado);
  } catch (erro) {
    console.error("Erro ao analisar Plano B:", erro);

    return res.status(500).json({
      mensagem: "Não foi possível realizar a análise do Plano B.",
    });
  }
}