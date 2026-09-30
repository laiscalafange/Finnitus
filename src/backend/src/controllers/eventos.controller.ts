import type { Request, Response } from "express";
import { criarEvento as criarEventosService } from "../services/eventos.service.js";

export async function criarEvento(
  req: Request,
  res: Response
) {
  try {
    const evento = await criarEventosService(req.body);

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
  return res.status(200).json([]);
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