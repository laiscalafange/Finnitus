
import { prisma } from "../lib/prisma.js";

export async function criarReservaFinanceira(dados: {
  id_Usuario: number;
  valor_atual: number;
  valor_desejado: number;
  objetivo?: string | null;
  localizacao?: string | null;
}) {
  return prisma.reservaFinanceira.create({
    data: {
      id_Usuario: dados.id_Usuario,
      valor_atual: dados.valor_atual,
      valor_desejado: dados.valor_desejado,
      objetivo: dados.objetivo ?? null,
      localizacao: dados.localizacao ?? null,
    },
  });
}

export async function buscarReservaFinanceira(id_Usuario: number) {
  return prisma.reservaFinanceira.findUnique({
    where: { id_Usuario },
  });
}

export async function atualizarReservaFinanceira(
  id_Usuario: number,
  dados: {
    valor_atual?: number;
    valor_desejado?: number;
    objetivo?: string | null;
    localizacao?: string | null;
  }
) {
  const reserva = await prisma.reservaFinanceira.findUnique({
    where: { id_Usuario },
  });

  if (!reserva) {
    return null;
  }

  return prisma.reservaFinanceira.update({
    where: { id_Usuario },
    data: {
      ...(dados.valor_atual !== undefined && {
        valor_atual: dados.valor_atual,
      }),
      ...(dados.valor_desejado !== undefined && {
        valor_desejado: dados.valor_desejado,
      }),
      ...(dados.objetivo !== undefined && {
        objetivo: dados.objetivo,
      }),
      ...(dados.localizacao !== undefined && {
        localizacao: dados.localizacao,
      }),
    },
  });
}

export async function excluirReservaFinanceira(id_Usuario: number) {
  const reserva = await prisma.reservaFinanceira.findUnique({
    where: { id_Usuario },
  });

  if (!reserva) {
    return null;
  }

  return prisma.reservaFinanceira.delete({
    where: { id_Usuario },
  });
}
