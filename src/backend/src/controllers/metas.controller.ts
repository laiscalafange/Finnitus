
import type {
  Request,
  Response,
} from "express";

import {
  criarMeta as criarMetaService,
  listarMetas as listarMetasService,
  buscarMeta as buscarMetaService,
  atualizarMeta as atualizarMetaService,
  adicionarAporte as adicionarAporteService,
  retirarDaMeta as retirarDaMetaService,
  cancelarMeta as cancelarMetaService,
  reabrirMeta as reabrirMetaService,
  listarHistorico as listarHistoricoService,
  obterAnalises as obterAnalisesService,
  registrarMetasIniciais as registrarMetasIniciaisService,
} from "../services/metas.service.js";

import { HttpError } from "../utils/errors.js";

// Converte e valida o ID recebido pela rota.
function obterId(
  valor: string | string[] | undefined,
): number {
  const valorId = Array.isArray(valor)
    ? valor[0]
    : valor;

  const id = Number(valorId);

  if (
    !valorId ||
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new HttpError(
      400,
      "ID da meta inválido.",
    );
  }

  return id;
}

// Cria uma meta normalmente configurada.
export async function criarMeta(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const meta = await criarMetaService({
    ...req.body,

    valorObjetivo: Number(
      req.body.valorObjetivo,
    ),

    valorInicial:
      req.body.valorInicial === undefined
        ? undefined
        : Number(req.body.valorInicial),

    valorPeriodo:
      req.body.valorPeriodo === undefined
        ? undefined
        : Number(req.body.valorPeriodo),

    id_Usuario: req.userId,
  });

  return res.status(201).json(meta);
}

// Lista as metas do usuário autenticado.
export async function listarMetas(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const mes =
    typeof req.query.mes === "string"
      ? req.query.mes
      : undefined;

  const metas = await listarMetasService(
    req.userId,
    mes,
  );

  return res.status(200).json(metas);
}

// Busca uma meta específica.
export async function buscarMeta(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const id_Meta = obterId(req.params.id);

  const meta = await buscarMetaService(
    req.userId,
    id_Meta,
  );

  return res.status(200).json(meta);
}

// Atualiza os dados de uma meta.
export async function atualizarMeta(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const id_Meta = obterId(req.params.id);

  const dados = {
    ...req.body,

    valorObjetivo:
      req.body.valorObjetivo === undefined
        ? undefined
        : Number(req.body.valorObjetivo),

    valorPeriodo:
      req.body.valorPeriodo === undefined ||
      req.body.valorPeriodo === null
        ? req.body.valorPeriodo
        : Number(req.body.valorPeriodo),
  };

  const meta = await atualizarMetaService(
    req.userId,
    id_Meta,
    dados,
  );

  return res.status(200).json(meta);
}

// Registra um aporte em uma meta.
export async function adicionarAporte(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const id_Meta = obterId(req.params.id);
  const valor = Number(req.body.valor);

  const resultado = await adicionarAporteService(
    req.userId,
    id_Meta,
    valor,
    req.body.descricao,
  );

  return res.status(201).json(resultado);
}

// Registra uma retirada de uma meta.
export async function retirarDaMeta(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const id_Meta = obterId(req.params.id);
  const valor = Number(req.body.valor);

  const resultado = await retirarDaMetaService(
    req.userId,
    id_Meta,
    valor,
    req.body.descricao,
  );

  return res.status(201).json(resultado);
}

// Cancela uma meta.
export async function cancelarMeta(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const id_Meta = obterId(req.params.id);

  const meta = await cancelarMetaService(
    req.userId,
    id_Meta,
  );

  return res.status(200).json({
    mensagem: "Meta cancelada com sucesso.",
    meta,
  });
}

// Reabre uma meta cancelada.
export async function reabrirMeta(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const id_Meta = obterId(req.params.id);

  const meta = await reabrirMetaService(
    req.userId,
    id_Meta,
  );

  return res.status(200).json({
    mensagem: "Meta reaberta com sucesso.",
    meta,
  });
}

// Lista o histórico de metas do usuário.
export async function listarHistorico(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const status =
    typeof req.query.status === "string"
      ? req.query.status
      : undefined;

  const metas = await listarHistoricoService(
    req.userId,
    status as "CONCLUIDA" | "CANCELADA" | undefined,
  );

  return res.status(200).json(metas);
}

// Retorna as análises financeiras das metas.
export async function obterAnalises(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const analises = await obterAnalisesService(
    req.userId,
  );

  return res.status(200).json(analises);
}

// Registra os objetivos escolhidos durante o onboarding.
export async function registrarMetasIniciais(
  req: Request,
  res: Response,
) {
  if (!req.userId) {
    throw new HttpError(
      401,
      "Usuário não autenticado.",
    );
  }

  const metas = await registrarMetasIniciaisService(
    req.userId,
    req.body.nomes,
  );

  return res.status(201).json({
    mensagem: "Objetivos iniciais registrados com sucesso.",
    metas,
  });
}
