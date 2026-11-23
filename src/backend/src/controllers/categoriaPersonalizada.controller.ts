
import type { Request, Response } from "express";
import type { Prisma } from "../../generated/prisma/client.js";
import type { CategoriaTipo } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

type DadosCategoria = {
  nome: string;
  tipo: CategoriaTipo;
};

type AtualizacaoCategoria = Partial<DadosCategoria>;

// Identifica o usuário autenticado.
function obterUsuario(req: Request): number {
  const usuarioId = Number(req.userId);

  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
    throw new HttpError(401, "Faça login novamente.");
  }

  return usuarioId;
}

// Valida o ID recebido na URL.
function obterId(req: Request): number {
  const valor = req.params.id;

  if (
    typeof valor !== "string" ||
    !/^[1-9]\d*$/.test(valor) ||
    Number(valor) > 2147483647
  ) {
    throw new HttpError(400, "ID de categoria inválido.");
  }

  return Number(valor);
}

// Evita duplicações por acentos e letras maiúsculas.
function normalizar(nome: string): string {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Valida o corpo da requisição.
function validarDados(
  body: unknown,
  parcial: false
): DadosCategoria;

function validarDados(
  body: unknown,
  parcial: true
): AtualizacaoCategoria;

function validarDados(
  body: unknown,
  parcial: boolean
): AtualizacaoCategoria {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    throw new HttpError(400, "Dados inválidos.");
  }

  const entrada = body as Record<string, unknown>;
  const campos = Object.keys(entrada);

  if (
    campos.length === 0 ||
    campos.some((campo) => !["nome", "tipo"].includes(campo))
  ) {
    throw new HttpError(400, "Campos de categoria inválidos.");
  }

  const dados: AtualizacaoCategoria = {};

  if (!parcial || "nome" in entrada) {
    if (
      typeof entrada.nome !== "string" ||
      !entrada.nome.trim() ||
      entrada.nome.trim().length > 100
    ) {
      throw new HttpError(
        400,
        "O nome deve ter entre 1 e 100 caracteres."
      );
    }

    dados.nome = entrada.nome.trim();
  }

  if (!parcial || "tipo" in entrada) {
    if (
      entrada.tipo !== "RECEITA" &&
      entrada.tipo !== "DESPESA"
    ) {
      throw new HttpError(400, "Tipo de categoria inválido.");
    }

    dados.tipo = entrada.tipo;
  }

  return dados;
}

// Confere se o nome já existe para esse usuário e tipo.
async function verificarDuplicidade(
  tx: Prisma.TransactionClient,
  usuarioId: number,
  nome: string,
  tipo: CategoriaTipo,
  ignorarId?: number
) {
  const categorias = await tx.categoriaPersonalizada.findMany({
    where: {
      id_Usuario: usuarioId,
      tipo,
    },
    select: {
      id_CategoriaPersonalizada: true,
      nome: true,
    },
  });

  const nomeNormalizado = normalizar(nome);
  const duplicada = categorias.some(
    (categoria) =>
      categoria.id_CategoriaPersonalizada !== ignorarId &&
      normalizar(categoria.nome) === nomeNormalizado
  );

  if (duplicada) {
    throw new HttpError(
      409,
      "Você já possui uma categoria com esse nome."
    );
  }
}

async function bloquearNomesDeCategorias(tx: Prisma.TransactionClient, usuarioId: number) {
  // Serializa criações e renomeações da conta. O índice do Prisma compara o nome original.
  await tx.$executeRaw`
    SELECT pg_advisory_xact_lock(hashtext('finnitus.categorias-personalizadas'), ${usuarioId}::integer)
  `;
}

async function bloquearCategoria(
  tx: Prisma.TransactionClient,
  usuarioId: number,
  categoriaId: number,
) {
  const [categoria] = await tx.$queryRaw<DadosCategoria[]>`
    SELECT "nome", "tipo" FROM "CategoriaPersonalizada"
    WHERE "id_CategoriaPersonalizada" = ${categoriaId}
      AND "id_Usuario" = ${usuarioId}
    FOR UPDATE
  `;
  if (!categoria) throw new HttpError(404, "Categoria não encontrada.");
  return categoria;
}

async function verificarCategoriaSemVinculos(tx: Prisma.TransactionClient, categoriaId: number) {
  const emUso = await tx.categoriaPersonalizada.findFirst({
    where: {
      id_CategoriaPersonalizada: categoriaId,
      OR: [
        { Receita: { some: {} } },
        { Despesa: { some: {} } },
        { Divida: { some: {} } },
      ],
    },
    select: { id_CategoriaPersonalizada: true },
  });

  if (emUso) {
    throw new HttpError(409, "Categoria em uso. Altere os registros vinculados primeiro.");
  }
}

// Trata conflitos de unicidade do Prisma.
function tratarErroBanco(error: unknown): never {
  if (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "P2002"
  ) {
    throw new HttpError(
      409,
      "Você já possui uma categoria com esse nome."
    );
  }

  throw error;
}

// ======================================
// POST - CRIAR CATEGORIA PERSONALIZADA
// ======================================
export async function criarCategoriaPersonalizada(
  req: Request,
  res: Response
) {
  const usuarioId = obterUsuario(req);
  const dados = validarDados(req.body, false);

  try {
    const categoria = await prisma.$transaction(async (tx) => {
      await bloquearNomesDeCategorias(tx, usuarioId);
      await verificarDuplicidade(tx, usuarioId, dados.nome, dados.tipo);
      return tx.categoriaPersonalizada.create({
        data: { ...dados, id_Usuario: usuarioId },
      });
    });

    return res.status(201).json(categoria);
  } catch (error) {
    return tratarErroBanco(error);
  }
}

// ======================================
// GET - LISTAR CATEGORIAS DO USUÁRIO
// ======================================
export async function listarCategoriasPersonalizadas(
  req: Request,
  res: Response
) {
  const usuarioId = obterUsuario(req);

  const categorias = await prisma.categoriaPersonalizada.findMany({
    where: {
      id_Usuario: usuarioId,
    },
    orderBy: {
      nome: "asc",
    },
  });

  return res.status(200).json(categorias);
}

// ======================================
// GET /:id - BUSCAR CATEGORIA
// ======================================
export async function buscarCategoriaPersonalizada(
  req: Request,
  res: Response
) {
  const usuarioId = obterUsuario(req);
  const categoriaId = obterId(req);

  const categoria = await prisma.categoriaPersonalizada.findFirst({
    where: {
      id_CategoriaPersonalizada: categoriaId,
      id_Usuario: usuarioId,
    },
  });

  if (!categoria) {
    throw new HttpError(404, "Categoria não encontrada.");
  }

  return res.status(200).json(categoria);
}

// ======================================
// PUT /:id - ATUALIZAR CATEGORIA
// ======================================
export async function atualizarCategoriaPersonalizada(
  req: Request,
  res: Response
) {
  const usuarioId = obterUsuario(req);
  const categoriaId = obterId(req);
  const dados = validarDados(req.body, true);

  try {
    const categoria = await prisma.$transaction(async (tx) => {
      await bloquearNomesDeCategorias(tx, usuarioId);
      const atual = await bloquearCategoria(tx, usuarioId, categoriaId);
      const tipo = dados.tipo ?? atual.tipo;
      if (tipo !== atual.tipo) await verificarCategoriaSemVinculos(tx, categoriaId);
      await verificarDuplicidade(tx, usuarioId, dados.nome ?? atual.nome, tipo, categoriaId);

      return tx.categoriaPersonalizada.update({
        where: { id_CategoriaPersonalizada: categoriaId, id_Usuario: usuarioId },
        data: dados,
      });
    });

    return res.status(200).json(categoria);
  } catch (error) {
    return tratarErroBanco(error);
  }
}

// ======================================
// DELETE /:id - EXCLUIR CATEGORIA
// ======================================
export async function excluirCategoriaPersonalizada(
  req: Request,
  res: Response
) {
  const usuarioId = obterUsuario(req);
  const categoriaId = obterId(req);

  await prisma.$transaction(async (tx) => {
    await bloquearCategoria(tx, usuarioId, categoriaId);
    await verificarCategoriaSemVinculos(tx, categoriaId);
    await tx.categoriaPersonalizada.delete({
      where: { id_CategoriaPersonalizada: categoriaId, id_Usuario: usuarioId },
    });
  });

  return res.status(204).end();
}
