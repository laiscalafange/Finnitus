
import type { Request, Response } from "express";

import {
  criarImprevisto as criarImprevistoService,
  listarImprevistos as listarImprevistosService,
  buscarImprevisto as buscarImprevistoService,
  atualizarImprevisto as atualizarImprevistoService,
  excluirImprevisto as excluirImprevistoService,
} from "../services/imprevisto.service.js";

export async function criarImprevisto(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const imprevisto = await criarImprevistoService({
    ...req.body,
    id_Usuario: req.userId,
  });

  return res.status(201).json(imprevisto);
}

export async function listarImprevistos(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const imprevistos = await listarImprevistosService(
    req.userId
  );

  return res.status(200).json(imprevistos);
}

export async function buscarImprevisto(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID do imprevisto inválido",
    });
  }

  const imprevisto = await buscarImprevistoService(
    id,
    req.userId
  );

  if (!imprevisto) {
    return res.status(404).json({
      mensagem: "Imprevisto não encontrado",
    });
  }

  return res.status(200).json(imprevisto);
}

export async function atualizarImprevisto(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID do imprevisto inválido",
    });
  }

  const imprevisto = await atualizarImprevistoService(
    id,
    req.userId,
    req.body
  );

  if (!imprevisto) {
    return res.status(404).json({
      mensagem: "Imprevisto não encontrado",
    });
  }

  return res.status(200).json(imprevisto);
}

export async function excluirImprevisto(
  req: Request,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado",
    });
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: "ID do imprevisto inválido",
    });
  }

  const imprevisto = await excluirImprevistoService(
    id,
    req.userId
  );

  if (!imprevisto) {
    return res.status(404).json({
      mensagem: "Imprevisto não encontrado",
    });
  }

  return res.status(200).json({
    mensagem: "Imprevisto excluído com sucesso",
  });
}
