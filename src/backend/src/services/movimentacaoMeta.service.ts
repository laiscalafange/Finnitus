
import { prisma } from "../lib/prisma.js";

export async function criarMovimentacaoMeta(
  dados: {
    id_Meta: number;
    valor: number;
    data: string;
    descricao?: string;
    tipo: "APORTE" | "RETIRADA";
  },
  id_Usuario: number
) {
  const meta = await prisma.meta.findFirst({
    where: {
      id_Meta: dados.id_Meta,
      id_Usuario,
    },
  });

  if (!meta) {
    throw new Error("Meta não encontrada");
  }

  return prisma.$transaction(async (tx) => {
    const movimentacao = await tx.movimentacaoMeta.create({
      data: {
        id_Meta: dados.id_Meta,
        valor: dados.valor,
        data: new Date(dados.data),
        descricao: dados.descricao,
        tipo: dados.tipo,
      },
    });

    const valorAtual = Number(meta.Mvalor_atual);
    const valorMovimentacao = Number(dados.valor);

    const novoValor =
      dados.tipo === "APORTE"
        ? valorAtual + valorMovimentacao
        : valorAtual - valorMovimentacao;

    await tx.meta.update({
      where: { id_Meta: dados.id_Meta },
      data: { Mvalor_atual: Math.max(0, novoValor) },
    });

    return movimentacao;
  });
}

export async function listarMovimentacoesMeta(id_Usuario: number) {
  return prisma.movimentacaoMeta.findMany({
    where: {
      Meta: { id_Usuario },
    },
    orderBy: { data: "desc" },
  });
}

export async function buscarMovimentacaoMeta(
  id: number,
  id_Usuario: number
) {
  return prisma.movimentacaoMeta.findFirst({
    where: {
      id_Movimentacao: id,
      Meta: { id_Usuario },
    },
  });
}

export async function atualizarMovimentacaoMeta(
  id: number,
  id_Usuario: number,
  dados: {
    valor?: number;
    data?: string;
    descricao?: string;
    tipo?: "APORTE" | "RETIRADA";
  }
) {
  const movimentacao = await prisma.movimentacaoMeta.findFirst({
    where: {
      id_Movimentacao: id,
      Meta: { id_Usuario },
    },
  });

  if (!movimentacao) {
    return null;
  }

  return prisma.movimentacaoMeta.update({
    where: { id_Movimentacao: id },
    data: {
      ...(dados.valor !== undefined && { valor: dados.valor }),
      ...(dados.data !== undefined && { data: new Date(dados.data) }),
      ...(dados.descricao !== undefined && {
        descricao: dados.descricao,
      }),
      ...(dados.tipo !== undefined && { tipo: dados.tipo }),
    },
  });
}

export async function excluirMovimentacaoMeta(
  id: number,
  id_Usuario: number
) {
  const movimentacao = await prisma.movimentacaoMeta.findFirst({
    where: {
      id_Movimentacao: id,
      Meta: { id_Usuario },
    },
  });

  if (!movimentacao) {
    return null;
  }

  return prisma.movimentacaoMeta.delete({
    where: { id_Movimentacao: id },
  });
}
