import { prisma } from "../lib/prisma.js";

export async function criarReservaFinanceira(dados: {
  id_Usuario: number;
  valor_atual: number;
  valor_desejado: number;
  objetivo: string;
  localizacao : string;

}) {
  const reservaFinanceira = await prisma.reservaFinanceira.create({
    data: {
      id_Usuario: dados.id_Usuario,
      valor_atual: dados.valor_atual,
      valor_desejado: dados.valor_desejado,
      objetivo: dados.objetivo,
      localizacao: dados.localizacao,
    },
  });

  return reservaFinanceira;
}