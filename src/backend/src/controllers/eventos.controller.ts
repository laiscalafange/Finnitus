import type { Request, Response } from "express";
import {criarEvento as criarEventosService,
  listarEventos as listarEventosService,
} from "../services/eventos.service.js";
export async function criarEvento(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        mensagem: "Usuário não autenticado",
      });
    }

    const evento = await criarEventosService({
      ...req.body,
      id_Usuario: req.userId,
    });

    return res.status(201).json(evento);
  } catch (error) {
    console.error("Erro ao criar evento:", error);

    return res.status(500).json({
      mensagem: "Erro ao criar evento",
    });
  }
}

export async function listarEventos(
  req: Request,
  res: Response
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

    const eventos = await listarEventosService(
      req.userId,
      inicio,
      fim,
    );

    return res.status(200).json(eventos);
  } catch (error) {
    console.error("Erro ao listar eventos:", error);

    return res.status(500).json({
      mensagem: "Erro ao listar eventos",
    });
  }
}

export async function buscarEvento(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    id
  });
}

export async function atualizarEvento(
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

export async function excluirEvento(
  req: Request,
  res: Response
) {
  const id = req.params.id;

  return res.status(200).json({
    mensagem: "Evento  excluída",
    id
  });
}

//req = requisicao res = resposta