import { HttpError } from "../utils/errors.js";
import type { Request, Response } from "express";
import {criarEvento as criarEventosService,
  listarEventos as listarEventosService,
  buscarEvento as buscarEventoService,
  atualizarEvento as atualizarEventoService,
  excluirEvento as excluirEventoService,
} from "../services/eventos.service.js";
export async function criarEvento(req: Request, res: Response) {
  if (!req.userId) throw new HttpError(401, "Usuário não autenticado.");
  const evento = await criarEventosService({ ...req.body, id_Usuario: req.userId });
  return res.status(201).json(evento);
}

export async function listarEventos(req: Request, res: Response) {
  if (!req.userId) throw new HttpError(401, "Usuário não autenticado.");
  const inicio = typeof req.query.inicio === "string" ? req.query.inicio : undefined;
  const fim = typeof req.query.fim === "string" ? req.query.fim : undefined;
  const eventos = await listarEventosService(req.userId, inicio, fim);
  return res.status(200).json(eventos);
}

function idEvento(req: Request) {
  const str = req.params.id;
  if (typeof str !== "string" || !/^[1-9]\d*$/.test(str) || !Number.isSafeInteger(+str)) throw new HttpError(400, "ID do evento inválido.");
  return Number(str);
}
function owner(req: Request) {
  if (!req.userId) throw new HttpError(401, "Faça login novamente.");
  return req.userId;
}
export async function buscarEvento(req: Request, res: Response) {
  const result = await buscarEventoService(idEvento(req), owner(req));
  if (!result) throw new HttpError(404, "Evento não encontrado.");
  res.json(result);
}
export async function atualizarEvento(req: Request, res: Response) {
  const result = await atualizarEventoService(idEvento(req), owner(req), req.body ?? {});
  if (!result) throw new HttpError(404, "Evento não encontrado.");
  res.json(result);
}
export async function excluirEvento(req: Request, res: Response) {
  const result = await excluirEventoService(idEvento(req), owner(req));
  if (!result) throw new HttpError(404, "Evento não encontrado.");
  res.status(204).end();
}
