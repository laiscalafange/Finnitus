import { prisma } from "../lib/prisma.js";

export async function criarReceita(dados: {
  id_Usuario: number;
  id_Categoria: number;
  descricao: string;
  valor: number;
  data_recebimento: string;
  tipo: "FIXA" | "VARIAVEL";
  frequencia: "UNICA" | "SEMANAL" | "QUINZENAL" | "MENSAL" | "ANUAL";
  observacao?: string;
}) {
  const receita = await prisma.receita.create({
    data: {
      id_Usuario: dados.id_Usuario,
      id_Categoria: dados.id_Categoria,
      descricao: dados.descricao,
      valor: dados.valor,
      data_recebimento: new Date(dados.data_recebimento),
      tipo: dados.tipo,
      frequencia: dados.frequencia,
      observacao: dados.observacao,
    },
  });

  return receita;
}