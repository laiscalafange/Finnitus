import type { Request, Response } from "express";
import {
  ErroReserva,
  consultarReserva,
  criarReserva,
  definirMetaReserva,
  depositarReserva,
  retirarReserva,
  excluirReserva,
} from "../services/reserva.service.js";

function usuarioAutenticado(req: Request): number {
  const id = req.userId;
  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
    throw new ErroReserva(401, "Usuário não autenticado.");
  }
  return id;
}

async function responder(
  res: Response,
  operacao: () => Promise<unknown>,
  sucesso = 200
): Promise<void> {
  try {
    const dados = await operacao();
    res.status(sucesso).json(dados);
  } catch (erro) {
    if (erro instanceof ErroReserva) {
      const { status, message } = erro;
      res.status(status).json({ mensagem: message });
      return;
    }

    console.error("Erro na reserva de emergência:", erro);
    res.status(500).json({ mensagem: "Não foi possível processar a reserva." });
  }
}

export async function buscarReserva(req: Request, res: Response): Promise<void> {
  await responder(res, () => consultarReserva(usuarioAutenticado(req)));
}

export async function criar(req: Request, res: Response): Promise<void> {
  await responder(res, () => criarReserva(usuarioAutenticado(req)), 201);
}

export async function definirMeta(req: Request, res: Response): Promise<void> {
  await responder(res, () => definirMetaReserva(usuarioAutenticado(req), req.body?.valor));
}

export async function depositar(req: Request, res: Response): Promise<void> {
  await responder(res, () => depositarReserva(usuarioAutenticado(req), req.body?.valor));
}

export async function retirar(req: Request, res: Response): Promise<void> {
  await responder(res, () => retirarReserva(usuarioAutenticado(req), req.body?.valor));
}

export async function excluir(req: Request, res: Response): Promise<void> {
  await responder(res, () => excluirReserva(usuarioAutenticado(req)));
}
