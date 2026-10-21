
import { prisma } from "../lib/prisma.js";

export type TipoItemCalendario =
  | "RECEITA"
  | "DESPESA"
  | "META"
  | "DIVIDA"
  | "EVENTO";

export type ItemCalendario = {
  id: number;
  titulo: string;
  data: Date;
  tipo: TipoItemCalendario;

  valor?: number;
  descricao?: string;

  horarioInicio?: Date;
  horarioFim?: Date;
  diaInteiro?: boolean;

  origem?: "FINNITUS" | "DISPOSITIVO";
  idEventoExterno?: string;
  statusFinanceiro?: string;
};

function converterDataUTC(data: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    throw new Error(
      `Data inválida no calendário: ${data}`
    );
  }

  const resultado = new Date(
    `${data}T00:00:00.000Z`
  );

  if (
    Number.isNaN(resultado.getTime()) ||
    resultado.toISOString().slice(0, 10) !== data
  ) {
    throw new Error(
      `Data inválida no calendário: ${data}`
    );
  }

  return resultado;
}

export async function listarItensCalendario(
  id_Usuario: number,
  inicio: string,
  fim: string
): Promise<ItemCalendario[]> {
  const dataInicio = converterDataUTC(inicio);
  const dataFim = converterDataUTC(fim);

  if (dataFim <= dataInicio) {
    throw new Error(
      "Período do calendário inválido."
    );
  }

  if (
    !Number.isInteger(id_Usuario) ||
    id_Usuario <= 0
  ) {
    throw new Error(
      "Usuário autenticado inválido."
    );
  }

  const [
    receitas,
    despesas,
    metas,
    dividas,
    eventos,
  ] = await Promise.all([
    prisma.receita.findMany({
      where: {
        id_Usuario,
        data_recebimento: {
          gte: dataInicio,
          lt: dataFim,
        },
      },
    }),

    prisma.despesa.findMany({
      where: {
        id_Usuario,
        data_vencimento: {
          gte: dataInicio,
          lt: dataFim,
        },
      },
    }),

    prisma.meta.findMany({
      where: {
        id_Usuario,
        Mprazo: {
          gte: dataInicio,
          lt: dataFim,
        },
      },
    }),

    prisma.divida.findMany({
      where: {
        id_Usuario,
        data_vencimento: {
          gte: dataInicio,
          lt: dataFim,
        },
      },
    }),

    prisma.evento.findMany({
      where: {
        id_Usuario,
        data_inicio: {
          gte: dataInicio,
          lt: dataFim,
        },
      },
    }),
  ]);

  // Logs temporários para investigar o problema.
  if (process.env.NODE_ENV !== "production") {
    console.log("CALENDÁRIO BACKEND:", {
      id_Usuario,
      inicio,
      fim,
      receitas: receitas.length,
      despesas: despesas.length,
      metas: metas.length,
      dividas: dividas.length,
      eventos: eventos.length,
    });
  }

  const itensReceitas: ItemCalendario[] =
    receitas.map((receita) => ({
      id: receita.id_Receita,
      titulo: receita.descricao,
      data: receita.data_recebimento,
      tipo: "RECEITA",
      valor: Number(receita.valor),
      descricao:
        receita.observacao ?? undefined,
    }));

  const itensDespesas: ItemCalendario[] =
    despesas.map((despesa) => ({
      id: despesa.id_Despesa,
      titulo: despesa.descricao,
      data: despesa.data_vencimento,
      tipo: "DESPESA",
      valor: Number(despesa.valor),
      descricao:
        despesa.observacao ?? undefined,
    }));

  const itensMetas: ItemCalendario[] =
    metas.flatMap((meta) =>
      meta.Mprazo === null
        ? []
        : [
            {
              id: meta.id_Meta,
              titulo: meta.Mnome,
              data: meta.Mprazo,
              tipo: "META" as const,
              valor: Number(
                meta.Mvalor_objetivo
              ),
            },
          ]
    );

  const itensDividas: ItemCalendario[] =
    dividas.map((divida) => ({
      id: divida.id_Divida,
      titulo: divida.nome,
      data: divida.data_vencimento,
      tipo: "DIVIDA",
      valor: Number(divida.valor_parcela),
    }));

  const itensEventos: ItemCalendario[] =
    eventos.map((evento) => ({
      id: evento.id_Evento,
      titulo: evento.Enome,
      data: evento.data_inicio,
      tipo: "EVENTO",

      valor:
        evento.valor_relacionado !== null
          ? Number(evento.valor_relacionado)
          : undefined,

      descricao:
        evento.Edescricao ?? undefined,

      horarioInicio: evento.data_inicio,

      horarioFim:
        evento.data_fim ?? undefined,

      diaInteiro: evento.dia_inteiro,

      origem: evento.origem,

      idEventoExterno:
        evento.id_evento_externo ?? undefined,

      statusFinanceiro:
        evento.status_financeiro,
    }));

  const itens: ItemCalendario[] = [
    ...itensReceitas,
    ...itensDespesas,
    ...itensMetas,
    ...itensDividas,
    ...itensEventos,
  ];

  return itens.sort(
    (a, b) =>
      a.data.getTime() - b.data.getTime()
  );
}
