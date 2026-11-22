
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

type TipoCategoria = "RECEITA" | "DESPESA";

type DadosCategoria = {
  nome: string;
  tipo: TipoCategoria;
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
    !Number.isSafeInteger(Number(valor))
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
  usuarioId: number,
  nome: string,
  tipo: TipoCategoria,
  ignorarId?: number
) {
  const categorias = await prisma.categoriaPersonalizada.findMany({
    where: {
      id_Usuario: usuarioId,
      tipo,
    },
    select: {
      id_CategoriaPersonalizada: true,
      nome: true,
    },
  });

  const duplicada = categorias.some(
    (categoria) =>
      categoria.id_CategoriaPersonalizada !== ignorarId &&
      normalizar(categoria.nome) === normalizar(nome)
  );

  if (duplicada) {
    throw new HttpError(
      409,
      "Você já possui uma categoria com esse nome."
    );
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

  await verificarDuplicidade(
    usuarioId,
    dados.nome,
    dados.tipo
  );

  try {
    const categoria = await prisma.categoriaPersonalizada.create({
      data: {
        nome: dados.nome,
        tipo: dados.tipo,
        id_Usuario: usuarioId,
      },
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

  const atual = await prisma.categoriaPersonalizada.findFirst({
    where: {
      id_CategoriaPersonalizada: categoriaId,
      id_Usuario: usuarioId,
    },
  });

  if (!atual) {
    throw new HttpError(404, "Categoria não encontrada.");
  }

  await verificarDuplicidade(
    usuarioId,
    dados.nome ?? atual.nome,
    dados.tipo ?? atual.tipo,
    categoriaId
  );

  try {
    const resultado = await prisma.categoriaPersonalizada.updateMany({
      where: {
        id_CategoriaPersonalizada: categoriaId,
        id_Usuario: usuarioId,
      },
      data: dados,
    });

    if (!resultado.count) {
      throw new HttpError(404, "Categoria não encontrada.");
    }

    const categoria = await prisma.categoriaPersonalizada.findFirst({
      where: {
        id_CategoriaPersonalizada: categoriaId,
        id_Usuario: usuarioId,
      },
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

  // Verifica se a categoria está sendo usada.
  const [receitas, despesas, dividas] = await Promise.all([
    prisma.receita.count({
      where: {
        id_Usuario: usuarioId,
        id_CategoriaPersonalizada: categoriaId,
      },
    }),
    prisma.despesa.count({
      where: {
        id_Usuario: usuarioId,
        id_CategoriaPersonalizada: categoriaId,
      },
    }),
    prisma.divida.count({
      where: {
        id_Usuario: usuarioId,
        id_CategoriaPersonalizada: categoriaId,
      },
    }),
  ]);

  if (receitas > 0 || despesas > 0 || dividas > 0) {
    throw new HttpError(
      409,
      "Categoria em uso. Altere os registros vinculados antes de excluir."
    );
  }

  const resultado = await prisma.categoriaPersonalizada.deleteMany({
    where: {
      id_CategoriaPersonalizada: categoriaId,
      id_Usuario: usuarioId,
    },
  });

  if (!resultado.count) {
    throw new HttpError(404, "Categoria não encontrada.");
  }

  return res.status(204).end();
}
