
import { prisma } from "../lib/prisma.js";

type DadosImprevisto = {
  id_Usuario: number;
  Inome: string;
  Ivalor: number;
  Idata: string;
  duracao_meses: number;
  solucao_escolhida: string;
  Idescricao: string;
  tipo:
    | "PERDA_RENDA"
    | "AUMENTO_DESPESA"
    | "DESPESA_INESPERADA"
    | "OUTRO";
};

export async function criarImprevisto(dados: DadosImprevisto) {
  return await prisma.imprevisto.create({
    data: {
      id_Usuario: dados.id_Usuario,
      Inome: dados.Inome,
      Ivalor: dados.Ivalor,
      Idata: new Date(dados.Idata),
      duracao_meses: dados.duracao_meses,
      solucao_escolhida: dados.solucao_escolhida,
      Idescricao: dados.Idescricao,
      tipo: dados.tipo,
    },
  });
}

export async function listarImprevistos(id_Usuario: number) {
  return await prisma.imprevisto.findMany({
    where: { id_Usuario },
    orderBy: { Idata: "desc" },
  });
}

export async function buscarImprevisto(
  id: number,
  id_Usuario: number
) {
  return await prisma.imprevisto.findFirst({
    where: {
      id_Imprevisto: id,
      id_Usuario,
    },
  });
}

export async function atualizarImprevisto(
  id: number,
  id_Usuario: number,
  dados: Partial<Omit<DadosImprevisto, "id_Usuario">>
) {
  const existente = await prisma.imprevisto.findFirst({
    where: {
      id_Imprevisto: id,
      id_Usuario,
    },
  });

  if (!existente) {
    return null;
  }

  return await prisma.imprevisto.update({
    where: { id_Imprevisto: id },
    data: {
      ...(dados.Inome !== undefined && { Inome: dados.Inome }),
      ...(dados.Ivalor !== undefined && { Ivalor: dados.Ivalor }),
      ...(dados.Idata !== undefined && {
        Idata: new Date(dados.Idata),
      }),
      ...(dados.duracao_meses !== undefined && {
        duracao_meses: dados.duracao_meses,
      }),
      ...(dados.solucao_escolhida !== undefined && {
        solucao_escolhida: dados.solucao_escolhida,
      }),
      ...(dados.Idescricao !== undefined && {
        Idescricao: dados.Idescricao,
      }),
      ...(dados.tipo !== undefined && { tipo: dados.tipo }),
    },
  });
}

export async function excluirImprevisto(
  id: number,
  id_Usuario: number
) {
  const existente = await prisma.imprevisto.findFirst({
    where: {
      id_Imprevisto: id,
      id_Usuario,
    },
  });

  if (!existente) {
    return null;
  }

  return await prisma.imprevisto.delete({
    where: { id_Imprevisto: id },
  });
}
