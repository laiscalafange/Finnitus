import { prisma } from "../lib/prisma.js";

export async function criarMovimentacaoMeta(dados: {
  id_Meta: number;
  valor: number;
  data: string;
  descricao?: string;
  tipo: "APORTE" | "RETIRADA";  
}) {
  const movimentacaoMeta = await prisma.movimentacaoMeta.create({
    data: {
      id_Meta: dados.id_Meta,
      valor: dados.valor,
      data: new Date(dados.data),
      descricao: dados.descricao,
      tipo: dados.tipo,
    },
  });

  return movimentacaoMeta;
}