import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

function owner(req: Request) {
  if (!req.userId) throw new HttpError(401, "Faça login novamente.");
  return req.userId;
}
function id(req: Request) {
  const value = req.params.id;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(+value))
    throw new HttpError(400, "ID inválido.");
  return Number(value);
}
function input(data: any, partial = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new HttpError(400, "Dados inválidos.");
  const keys = Object.keys(data);
  if (!keys.length || keys.some(k => !["nome", "tipo"].includes(k))) throw new HttpError(400, "Campos de categoria inválidos.");
  if (!partial || data.nome !== undefined) {
    if (typeof data.nome !== "string" || !data.nome.trim() || data.nome.trim().length > 100) throw new HttpError(400, "Nome inválido.");
  }
  if ((!partial || data.tipo !== undefined) && !["RECEITA", "DESPESA"].includes(data.tipo)) throw new HttpError(400, "Tipo inválido.");
  return { ...(data.nome !== undefined ? { nome: data.nome.trim() } : {}), ...(data.tipo !== undefined ? { tipo: data.tipo } : {}) };
}
export async function criarCategoriaPersonalizada(req: Request, res: Response) {
  const data = input(req.body);
  const registro = await prisma.categoriaPersonalizada.create({ data: { ...data, id_Usuario: owner(req) } as any });
  res.status(201).json(registro);
}
export async function listarCategoriasPersonalizadas(req: Request, res: Response) {
  res.json(await prisma.categoriaPersonalizada.findMany({ where: { id_Usuario: owner(req) }, orderBy: { nome: "asc" } }));
}
export async function buscarCategoriaPersonalizada(req: Request, res: Response) {
  const record = await prisma.categoriaPersonalizada.findFirst({ where: { id_CategoriaPersonalizada: id(req), id_Usuario: owner(req) } });
  if (!record) throw new HttpError(404, "Categoria não encontrada.");
  res.json(record);
}
export async function atualizarCategoriaPersonalizada(req: Request, res: Response) {
  const idCategoria = id(req); const idUsuario = owner(req);
  const changes = input(req.body, true);
  const changed = await prisma.categoriaPersonalizada.updateMany({ where: { id_CategoriaPersonalizada: idCategoria, id_Usuario: idUsuario }, data: changes });
  if (!changed.count) throw new HttpError(404, "Categoria não encontrada.");
  res.json(await prisma.categoriaPersonalizada.findFirst({ where: { id_CategoriaPersonalizada: idCategoria, id_Usuario: idUsuario } }));
}
export async function excluirCategoriaPersonalizada(req: Request, res: Response) {
  const idCategoria = id(req); const idUsuario = owner(req);
  // Categoria em uso não é excluída: evita quebrar referências financeiras.
  const vinculos = await Promise.all([
    prisma.receita.count({ where: { id_Usuario: idUsuario, id_CategoriaPersonalizada: idCategoria } }),
    prisma.despesa.count({ where: { id_Usuario: idUsuario, id_CategoriaPersonalizada: idCategoria } }),
    prisma.divida.count({ where: { id_Usuario: idUsuario, id_CategoriaPersonalizada: idCategoria } }),
  ]);
  if (vinculos.some(Boolean)) throw new HttpError(409, "Categoria em uso. Altere os registros vinculados antes de excluir.");
  const result = await prisma.categoriaPersonalizada.deleteMany({ where: { id_CategoriaPersonalizada: idCategoria, id_Usuario: idUsuario } });
  if (!result.count) throw new HttpError(404, "Categoria não encontrada.");
  res.status(204).end();
}
