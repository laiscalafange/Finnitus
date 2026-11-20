import type { Request, Response } from "express";
import {
  configuracao2FA,
  confirmarAlteracao,
  confirmarLogin,
  solicitarAlteracao,
  type SessaoAtual,
} from "../services/seguranca.service.js";
import { listarSessoes, revogarSessao } from "../services/sessao.service.js";
import { HttpError } from "../utils/errors.js";
import { objectBody } from "../utils/validation.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SESSAO_LEGADA = /^legacy-[0-9a-f]{64}$/;

function sessaoAtual(req: Request): SessaoAtual {
  const { userId, tokenVersion, sessaoId } = req;
  if (!userId || tokenVersion === undefined || !sessaoId) {
    throw new HttpError(401, "Sessão não identificada.");
  }
  return { userId, tokenVersion, sessaoId };
}

function dadosCodigo(body: Record<string, unknown>) {
  const { challengeId, codigo } = body;
  if (typeof challengeId !== "string" || !UUID.test(challengeId)) {
    throw new HttpError(400, "Solicite um novo código.");
  }
  if (typeof codigo !== "string" || !/^\d{6}$/.test(codigo)) {
    throw new HttpError(400, "Informe os 6 dígitos do código.");
  }
  return { challengeId, codigo };
}

export async function verificarLogin2FA(req: Request, res: Response) {
  const { challengeId, codigo } = dadosCodigo(objectBody(req.body));
  res.json(await confirmarLogin(challengeId, codigo));
}

export async function verConfiguracao2FA(req: Request, res: Response) {
  const { userId } = sessaoAtual(req);
  res.json(await configuracao2FA(userId));
}

export async function ativar2FA(req: Request, res: Response) {
  res.json(await solicitarAlteracao(sessaoAtual(req), true));
}

export async function confirmar2FA(req: Request, res: Response) {
  const { challengeId, codigo } = dadosCodigo(objectBody(req.body));
  res.json(await confirmarAlteracao(sessaoAtual(req), challengeId, codigo, true));
}

export async function desativar2FA(req: Request, res: Response) {
  const sessao = sessaoAtual(req);
  const body = objectBody(req.body);
  if (Object.keys(body).length === 0) {
    res.json(await solicitarAlteracao(sessao, false));
    return;
  }
  const { challengeId, codigo } = dadosCodigo(body);
  res.json(await confirmarAlteracao(sessao, challengeId, codigo, false));
}

export async function verSessoes(req: Request, res: Response) {
  const { userId, tokenVersion, sessaoId } = sessaoAtual(req);
  res.json({ sessoes: await listarSessoes(userId, tokenVersion, sessaoId) });
}

export async function desconectarSessao(req: Request, res: Response) {
  const { userId, tokenVersion } = sessaoAtual(req);
  const id = req.params.id;
  if (typeof id !== "string" || (!UUID.test(id) && !SESSAO_LEGADA.test(id))) {
    throw new HttpError(400, "Dispositivo inválido.");
  }
  await revogarSessao(userId, tokenVersion, id);
  res.status(204).end();
}
