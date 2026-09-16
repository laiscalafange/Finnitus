import { prisma } from "../lib/prisma.js";

export async function criarReceita(dados: {
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  tipo: string;
  observacao?: string;
  usuarioId: number;
}) {
  const receita = await prisma.receita.create({
    data: {
      descricao: dados.descricao,
      valor: dados.valor,
      data: new Date(dados.data),
      categoria: dados.categoria,
      tipo: dados.tipo,
      observacao: dados.observacao,
      usuarioId: dados.usuarioId,
    },
  });

  return receita;

}