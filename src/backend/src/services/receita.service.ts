
import { prisma } from "../lib/prisma.js";

export async function criarReceita(dados: {
  id_Usuario: number;
  id_Categoria: number;
  id_CategoriaPersonalizada?: number;
  descricao: string;
  valor: number;
  data_recebimento: string;
  tipo: "FIXA" | "VARIAVEL";
  status: "RECEBIDA" | "PENDENTE";
  frequencia: "UNICA" | "SEMANAL" | "QUINZENAL" | "MENSAL" | "ANUAL";
  observacao?: string;
}) {
  return prisma.receita.create({
    data: {
      id_Usuario: dados.id_Usuario,
      id_Categoria: dados.id_Categoria,
      id_CategoriaPersonalizada: dados.id_CategoriaPersonalizada,
      descricao: dados.descricao,
      valor: dados.valor,
      data_recebimento: new Date(dados.data_recebimento),
      tipo: dados.tipo,
      status: dados.status,
      frequencia: dados.frequencia,
      observacao: dados.observacao,
    },
  });
}

export async function listarReceitas(id_Usuario: number) {
  return prisma.receita.findMany({
    where: { id_Usuario },
    orderBy: { data_recebimento: "asc" },
  });
}

export async function buscarReceita(
  id_Receita: number,
  id_Usuario: number
) {
  return prisma.receita.findFirst({
    where: {
      id_Receita,
      id_Usuario,
    },
  });
}

export async function atualizarReceita(
  id_Receita: number,
  id_Usuario: number,
  dados: {
    id_Categoria?: number | null;
    id_CategoriaPersonalizada?: number | null;
    descricao?: string;
    valor?: number;
    data_recebimento?: string;
    tipo?: "FIXA" | "VARIAVEL";
    frequencia?: "UNICA" | "SEMANAL" | "QUINZENAL" | "MENSAL" | "ANUAL";
    status?: "ATIVA" | "INATIVA";
    observacao?: string | null;
  }
) {
  const existente = await buscarReceita(id_Receita, id_Usuario);

  if (!existente) {
    return null;
  }

  return prisma.receita.update({
    where: { id_Receita },
    data: {
      id_Categoria: dados.id_Categoria,
      id_CategoriaPersonalizada: dados.id_CategoriaPersonalizada,
      descricao: dados.descricao,
      valor: dados.valor,
      data_recebimento: dados.data_recebimento
        ? new Date(dados.data_recebimento)
        : undefined,
      tipo: dados.tipo,
      frequencia: dados.frequencia,
      status: dados.status,
      observacao: dados.observacao,
    },
  });
}

export async function excluirReceita(
  id_Receita: number,
  id_Usuario: number
) {
  const existente = await buscarReceita(id_Receita, id_Usuario);

  if (!existente) {
    return null;
  }

  return prisma.receita.delete({
    where: { id_Receita },
  });
}
