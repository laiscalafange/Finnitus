import type { Request, Response } from "express";
import { listarItensCalendario } from "../services/calendario.service.js";

export async function listarCalendario(
  req: Request,
  res: Response,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado",
      });
    }

    const inicio =
      typeof req.query.inicio === "string"
        ? req.query.inicio
        : undefined;

    const fim =
      typeof req.query.fim === "string"
        ? req.query.fim
        : undefined;

    if (!inicio || !fim) {
      return res.status(400).json({
        mensagem: "Informe as datas de início e fim.",
      });
    }

    const itens = await listarItensCalendario(
      req.userId,
      inicio,
      fim,
    );

    return res.status(200).json(itens);
  } catch (error) {
    console.error("Erro ao listar calendário:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar calendário",
    });
  }
}