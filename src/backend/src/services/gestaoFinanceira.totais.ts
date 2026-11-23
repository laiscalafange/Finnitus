import type { Prisma } from "../../generated/prisma/client.js";

type BancoMovimentacoes = Pick<Prisma.TransactionClient, "receita" | "despesa">;

const dataEmSaoPaulo = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "America/Sao_Paulo",
});

export function obterDiaFinanceiro(data = new Date()): string {
  return dataEmSaoPaulo.format(data);
}

export async function somarMovimentacoesRealizadas(
  banco: BancoMovimentacoes,
  idUsuario: number,
  inicio: Date,
  fim: Date,
) {
  const periodo = { gte: inicio, lt: fim };
  const [receitas, despesas] = await Promise.all([
    banco.receita.aggregate({
      where: { id_Usuario: idUsuario, status: "RECEBIDA", data_recebimento: periodo },
      _sum: { valor: true },
    }),
    banco.despesa.aggregate({
      where: {
        id_Usuario: idUsuario,
        status: "PAGA",
        OR: [
          { data_pagamento: periodo },
          { data_pagamento: null, data_vencimento: periodo },
        ],
      },
      _sum: { valor: true },
    }),
  ]);

  return {
    receitas: Number(receitas._sum.valor ?? 0),
    despesas: Number(despesas._sum.valor ?? 0),
  };
}
