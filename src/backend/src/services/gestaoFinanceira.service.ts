
import { prisma } from "../lib/prisma.js";
import { obterDiaFinanceiro, somarMovimentacoesRealizadas } from "./gestaoFinanceira.totais.js";

/*
 * Define os períodos disponíveis para consultar os indicadores.
 *
 * DIARIO: um dia específico.
 * MENSAL: um mês completo.
 * ANUAL: um ano completo.
 */
export type PeriodoFinanceiro = "DIARIO" | "MENSAL" | "ANUAL";

/*
 * Representa o intervalo de datas utilizado nas consultas.
 *
 * inicio: primeiro instante incluído na consulta.
 * fim: primeiro instante que já não pertence ao período.
 *
 * Usar um fim exclusivo evita problemas com horários
 * no último dia do período.
 */
type IntervaloFinanceiro = {
  inicio: Date;
  fim: Date;
};

/*
 * Converte valores financeiros do Prisma para number.
 *
 * Campos Decimal do Prisma não devem ser tratados como
 * números JavaScript sem conversão explícita.
 */
function converterParaNumero(valor: unknown): number {
  return Number(valor);
}

/*
 * Arredonda o resultado para duas casas decimais.
 *
 * Essa formatação é aplicada aos valores devolvidos pela API.
 * Para cálculos financeiros que exijam precisão rigorosa,
 * o ideal é realizar as operações com Decimal até o final.
 */
function formatarValor(valor: number): number {
  return Number(valor.toFixed(2));
}

/*
 * Valida e converte uma data no formato YYYY-MM-DD.
 *
 * Além de verificar o formato, confere se o dia existe.
 * Por exemplo, uma data como 2026-02-30 será rejeitada.
 */

function converterData(data: string): Date {
  // Verifica se a data está no formato AAAA-MM-DD.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    throw new Error("Data inválida. Use o formato AAAA-MM-DD.");
  }

  // Separa o ano, o mês e o dia.
  const partes = data.split("-");

  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  // Garante que os componentes sejam números inteiros válidos.
  if (
    !Number.isInteger(ano) ||
    !Number.isInteger(mes) ||
    !Number.isInteger(dia)
  ) {
    throw new Error("A data informada é inválida.");
  }

  // Cria a data em UTC para evitar problemas de fuso horário.
  const dataConvertida = new Date(
    Date.UTC(ano, mes - 1, dia),
  );

  // Verifica se a data realmente existe no calendário.
  if (
    dataConvertida.getUTCFullYear() !== ano ||
    dataConvertida.getUTCMonth() !== mes - 1 ||
    dataConvertida.getUTCDate() !== dia
  ) {
    throw new Error("A data informada não existe.");
  }

  // Retorna a data validada.
  return dataConvertida;
}


export type PeriodoDashboard = "SEMANAL" | "MENSAL";

type TotaisIntervalo = {
  receitasRecebidas: number;
  receitasPendentes: number;
  despesasPagas: number;
  despesasPendentes: number;
};

function obterIntervaloSemana(dataReferencia: string): IntervaloFinanceiro {
  const data = converterData(dataReferencia);

  // Identifica a segunda-feira da semana da data informada.
  const diaSemana = data.getUTCDay();
  const diferenca = diaSemana === 0 ? 6 : diaSemana - 1;

  const inicio = new Date(data);
  inicio.setUTCDate(inicio.getUTCDate() - diferenca);

  const fim = new Date(inicio);
  fim.setUTCDate(fim.getUTCDate() + 7);

  return { inicio, fim };
}

async function obterTotaisIntervalo(
  id_Usuario: number,
  inicio: Date,
  fim: Date,
): Promise<TotaisIntervalo> {
  const [
    receitasRecebidas,
    receitasPendentes,
    despesasPagas,
    despesasPendentes,
  ] = await Promise.all([
    prisma.receita.findMany({
      where: {
        id_Usuario,
        status: "RECEBIDA",
        data_recebimento: { gte: inicio, lt: fim },
      },
      select: { valor: true },
    }),

    prisma.receita.findMany({
      where: {
        id_Usuario,
        status: "PENDENTE",
        data_recebimento: { gte: inicio, lt: fim },
      },
      select: { valor: true },
    }),

    prisma.despesa.findMany({
      where: {
        id_Usuario,
        status: "PAGA",
        data_pagamento: { gte: inicio, lt: fim },
      },
      select: { valor: true },
    }),

    prisma.despesa.findMany({
      where: {
        id_Usuario,
        status: "PENDENTE",
        data_vencimento: { gte: inicio, lt: fim },
      },
      select: { valor: true },
    }),
  ]);

  return {
    receitasRecebidas: receitasRecebidas.reduce(
      (total, item) => total + converterParaNumero(item.valor),
      0,
    ),

    receitasPendentes: receitasPendentes.reduce(
      (total, item) => total + converterParaNumero(item.valor),
      0,
    ),

    despesasPagas: despesasPagas.reduce(
      (total, item) => total + converterParaNumero(item.valor),
      0,
    ),

    despesasPendentes: despesasPendentes.reduce(
      (total, item) => total + converterParaNumero(item.valor),
      0,
    ),
  };
}

function formatarResumoIntervalo(totais: TotaisIntervalo) {
  const saldoRealizado =
    totais.receitasRecebidas - totais.despesasPagas;

  const saldoProjetado =
    totais.receitasRecebidas +
    totais.receitasPendentes -
    totais.despesasPagas -
    totais.despesasPendentes;

  return {
    receitas: {
      recebidas: formatarValor(totais.receitasRecebidas),
      pendentes: formatarValor(totais.receitasPendentes),
    },
    despesas: {
      pagas: formatarValor(totais.despesasPagas),
      pendentes: formatarValor(totais.despesasPendentes),
    },
    saldoRealizado: formatarValor(saldoRealizado),
    saldoProjetado: formatarValor(saldoProjetado),
  };
}

function calcularVariacaoPercentual(
  atual: number,
  anterior: number,
): number | null {
  if (anterior === 0) {
    return atual === 0 ? 0 : null;
  }

  return formatarValor(((atual - anterior) / anterior) * 100);
}


function calcularIntervalo(
  periodo: PeriodoFinanceiro,
  dataReferencia: string,
): IntervaloFinanceiro {
  const data = converterData(dataReferencia);

  let inicio: Date;
  let fim: Date;

  switch (periodo) {
    case "DIARIO": {
      // O período começa à meia-noite do dia informado.
      inicio = new Date(data);

      // Termina à meia-noite do dia seguinte.
      fim = new Date(data);
      fim.setUTCDate(fim.getUTCDate() + 1);

      break;
    }

    case "MENSAL": {
      // O período começa no primeiro dia do mês informado.
      inicio = new Date(
        Date.UTC(
          data.getUTCFullYear(),
          data.getUTCMonth(),
          1,
        ),
      );

      // O período termina no primeiro dia do mês seguinte.
      fim = new Date(
        Date.UTC(
          data.getUTCFullYear(),
          data.getUTCMonth() + 1,
          1,
        ),
      );

      break;
    }

    case "ANUAL": {
      // O período começa no primeiro dia do ano informado.
      inicio = new Date(
        Date.UTC(data.getUTCFullYear(), 0, 1),
      );

      // O período termina no primeiro dia do ano seguinte.
      fim = new Date(
        Date.UTC(data.getUTCFullYear() + 1, 0, 1),
      );

      break;
    }

    default:
      // Protege também contra valores inválidos recebidos em runtime.
      throw new Error(
        "Período inválido. Utilize DIARIO, MENSAL ou ANUAL.",
      );
  }

  return { inicio, fim };
}

/*
 * Consulta e calcula os indicadores financeiros de um período.
 *
 * IMPORTANTE:
 * id_Usuario deve vir do usuário autenticado pelo middleware.
 * Nunca deve ser considerado confiável se vier livremente
 * do corpo da requisição ou de um parâmetro da URL.
 *
 * Esta função é a base reutilizável dos cálculos financeiros
 * da tela inicial e do dashboard.
 */
export async function obterResumoFinanceiro(
  id_Usuario: number,
  periodo: PeriodoFinanceiro = "MENSAL",
  dataReferencia: string = obterDiaFinanceiro(),
) {
  /*
   * Valida o identificador para impedir consultas
   * com valores inválidos.
   */
  if (!Number.isInteger(id_Usuario) || id_Usuario <= 0) {
    throw new Error("Identificador do usuário inválido.");
  }

  /*
   * Calcula as datas inicial e final da consulta.
   */
  const { inicio, fim } = calcularIntervalo(
    periodo,
    dataReferencia,
  );

  const {
    receitas: totalReceitasRecebidas,
    despesas: totalDespesasPagas,
  } = await somarMovimentacoesRealizadas(prisma, id_Usuario, inicio, fim);

  /*
   * Consulta as receitas que ainda estão pendentes.
   *
   * Elas não entram no saldo realizado, pois o dinheiro
   * ainda não foi confirmado como recebido.
   *
   * A data_recebimento funciona como data prevista
   * para o recebimento, conforme o modelo atual.
   */
  const receitasPendentes = await prisma.receita.findMany({
    where: {
      id_Usuario,
      status: "PENDENTE",
      data_recebimento: {
        gte: inicio,
        lt: fim,
      },
    },
    select: {
      valor: true,
    },
  });

  /*
   * Consulta as despesas pendentes cujo vencimento
   * pertence ao período solicitado.
   *
   * Essas despesas ainda não foram pagas, mas precisam
   * ser consideradas na projeção financeira.
   */
  const despesasPendentes = await prisma.despesa.findMany({
    where: {
      id_Usuario,
      status: "PENDENTE",
      data_vencimento: {
        gte: inicio,
        lt: fim,
      },
    },
    select: {
      valor: true,
    },
  });

  /*
   * Soma as receitas que ainda estão pendentes.
   */
  const totalReceitasPendentes = receitasPendentes.reduce(
    (total, receita) =>
      total + converterParaNumero(receita.valor),
    0,
  );

  /*
   * Soma as despesas que ainda precisam ser pagas.
   */
  const totalDespesasPendentes = despesasPendentes.reduce(
    (total, despesa) =>
      total + converterParaNumero(despesa.valor),
    0,
  );

  /*
   * Calcula a movimentação líquida realizada no período.
   *
   * Fórmula:
   * receitas recebidas - despesas pagas.
   *
   * ATENÇÃO:
   * Este resultado não representa necessariamente todo
   * o dinheiro disponível na conta do usuário.
   * Ele representa apenas a movimentação líquida
   * encontrada dentro do período consultado.
   */
  const saldoRealizado =
    totalReceitasRecebidas - totalDespesasPagas;

  /*
   * Calcula a movimentação líquida projetada do período.
   *
   * Fórmula:
   * receitas recebidas
   * + receitas pendentes
   * - despesas pagas
   * - despesas pendentes.
   *
   * É uma projeção baseada nos registros cadastrados.
   * Não representa uma garantia de recebimento ou pagamento.
   */
  const saldoProjetado =
    totalReceitasRecebidas +
    totalReceitasPendentes -
    totalDespesasPagas -
    totalDespesasPendentes;

  /*
   * Devolve os resultados organizados por assunto.
   *
   * O controller poderá enviar esse objeto como JSON
   * para o aplicativo.
   */
  return {
    periodo,

    dataReferencia,

    intervalo: {
      inicio: inicio.toISOString().slice(0, 10),

      // A data final é exclusiva: não está incluída na consulta.
      fimExclusivo: fim.toISOString().slice(0, 10),
    },

    receitas: {
      recebidas: formatarValor(totalReceitasRecebidas),
      pendentes: formatarValor(totalReceitasPendentes),
    },

    despesas: {
      pagas: formatarValor(totalDespesasPagas),
      pendentes: formatarValor(totalDespesasPendentes),
    },

    saldoRealizado: formatarValor(saldoRealizado),

    saldoProjetado: formatarValor(saldoProjetado),
  };
}

/*
 * Prepara os indicadores essenciais para a tela inicial.
 *
 * Por enquanto, utiliza o resumo do mês atual.
 * Depois podemos incluir próximos vencimentos e outros
 * indicadores específicos sem duplicar os cálculos básicos.
 */
export async function obterResumoTelaInicial(
  id_Usuario: number,
) {
  return obterResumoFinanceiro(
    id_Usuario,
    "MENSAL",
    obterDiaFinanceiro(),
  );
}

/*
 * Prepara os indicadores financeiros para o dashboard.
 *
 * Permite consultar um dia, mês ou ano específico.
 * O dashboard poderá chamar essa função com filtros
 * selecionados pelo usuário no aplicativo.
 *
 * Os gráficos, categorias, metas e evolução histórica
 * serão adicionados em funções complementares do mesmo
 * service, conforme definirmos os indicadores necessários.
 */
export async function obterDadosDashboard(
  id_Usuario: number,
  periodo: PeriodoFinanceiro = "MENSAL",
  dataReferencia: string = obterDiaFinanceiro(),
) {
  return obterResumoFinanceiro(
    id_Usuario,
    periodo,
    dataReferencia,
  );
}


export async function obterComparativoDashboard(
  id_Usuario: number,
  periodo: PeriodoDashboard,
  dataReferencia: string = obterDataLocal(),
) {
  if (!Number.isInteger(id_Usuario) || id_Usuario <= 0) {
    throw new Error("Identificador do usuário inválido.");
  }

  let intervaloAtual: IntervaloFinanceiro;
  let intervaloAnterior: IntervaloFinanceiro;

  if (periodo === "SEMANAL") {
    intervaloAtual = obterIntervaloSemana(dataReferencia);

    const inicioAnterior = new Date(intervaloAtual.inicio);
    inicioAnterior.setUTCDate(inicioAnterior.getUTCDate() - 7);

    intervaloAnterior = {
      inicio: inicioAnterior,
      fim: new Date(intervaloAtual.inicio),
    };
  } else {
    intervaloAtual = calcularIntervalo("MENSAL", dataReferencia);

    const inicioAnterior = new Date(intervaloAtual.inicio);
    inicioAnterior.setUTCMonth(inicioAnterior.getUTCMonth() - 1);

    intervaloAnterior = {
      inicio: inicioAnterior,
      fim: new Date(intervaloAtual.inicio),
    };
  }

  const [totaisAtuais, totaisAnteriores] = await Promise.all([
    obterTotaisIntervalo(
      id_Usuario,
      intervaloAtual.inicio,
      intervaloAtual.fim,
    ),

    obterTotaisIntervalo(
      id_Usuario,
      intervaloAnterior.inicio,
      intervaloAnterior.fim,
    ),
  ]);

  const atual = formatarResumoIntervalo(totaisAtuais);
  const anterior = formatarResumoIntervalo(totaisAnteriores);

  return {
    periodo,
    dataReferencia,

    atual: {
      ...atual,
      intervalo: {
        inicio: intervaloAtual.inicio.toISOString().slice(0, 10),
        fimExclusivo: intervaloAtual.fim.toISOString().slice(0, 10),
      },
    },

    anterior: {
      ...anterior,
      intervalo: {
        inicio: intervaloAnterior.inicio.toISOString().slice(0, 10),
        fimExclusivo: intervaloAnterior.fim.toISOString().slice(0, 10),
      },
    },

    comparacao: {
      despesasPagas: {
        diferenca: formatarValor(
          totaisAtuais.despesasPagas - totaisAnteriores.despesasPagas,
        ),
        variacaoPercentual: calcularVariacaoPercentual(
          totaisAtuais.despesasPagas,
          totaisAnteriores.despesasPagas,
        ),
      },

      receitasRecebidas: {
        diferenca: formatarValor(
          totaisAtuais.receitasRecebidas -
          totaisAnteriores.receitasRecebidas,
        ),
        variacaoPercentual: calcularVariacaoPercentual(
          totaisAtuais.receitasRecebidas,
          totaisAnteriores.receitasRecebidas,
        ),
      },
    },
  };
}

export async function obterDistribuicaoDespesas(
  id_Usuario: number,
  periodo: PeriodoDashboard,
  dataReferencia: string = obterDataLocal(),
) {
  if (!Number.isInteger(id_Usuario) || id_Usuario <= 0) {
    throw new Error("Identificador do usuário inválido.");
  }

  const intervalo =
    periodo === "SEMANAL"
      ? obterIntervaloSemana(dataReferencia)
      : calcularIntervalo("MENSAL", dataReferencia);

  const despesas = await prisma.despesa.findMany({
    where: {
      id_Usuario,
      status: "PAGA",
      data_pagamento: {
        gte: intervalo.inicio,
        lt: intervalo.fim,
      },
    },
    select: {
      valor: true,
      id_Categoria: true,
      id_CategoriaPersonalizada: true,
      Categoria: {
        select: {
          nome: true,
        },
      },
      CategoriaPersonalizada: {
        select: {
          nome: true,
        },
      },
    },
  });

  const categorias = new Map<
    string,
    { categoria: string; total: number }
  >();

  for (const despesa of despesas) {
    const nomeCategoria =
      despesa.CategoriaPersonalizada?.nome ??
      despesa.Categoria?.nome ??
      "Sem categoria";

    const chave =
      despesa.id_CategoriaPersonalizada !== null
        ? `personalizada-${despesa.id_CategoriaPersonalizada}`
        : despesa.id_Categoria !== null
          ? `padrao-${despesa.id_Categoria}`
          : "sem-categoria";

    const atual = categorias.get(chave);

    if (atual) {
      atual.total += converterParaNumero(despesa.valor);
    } else {
      categorias.set(chave, {
        categoria: nomeCategoria,
        total: converterParaNumero(despesa.valor),
      });
    }
  }

  const totalGeral = despesas.reduce(
    (total, despesa) =>
      total + converterParaNumero(despesa.valor),
    0,
  );

  const distribuicao = Array.from(categorias.values())
    .map((item) => ({
      categoria: item.categoria,
      valor: formatarValor(item.total),
      percentual:
        totalGeral > 0
          ? formatarValor((item.total / totalGeral) * 100)
          : 0,
    }))
    .sort((a, b) => b.valor - a.valor);

  return {
    periodo,
    dataReferencia,
    totalDespesasPagas: formatarValor(totalGeral),
    maiorGasto: distribuicao[0] ?? null,
    categorias: distribuicao,
  };
}

export async function obterComprometimentoRenda(
  id_Usuario: number,
  periodo: PeriodoDashboard,
  dataReferencia: string = obterDataLocal(),
) {
  if (!Number.isInteger(id_Usuario) || id_Usuario <= 0) {
    throw new Error("Identificador do usuário inválido.");
  }

  const intervalo =
    periodo === "SEMANAL"
      ? obterIntervaloSemana(dataReferencia)
      : calcularIntervalo("MENSAL", dataReferencia);

  const totais = await obterTotaisIntervalo(
    id_Usuario,
    intervalo.inicio,
    intervalo.fim,
  );

  const rendaRecebida = totais.receitasRecebidas;
  const rendaPrevista =
    totais.receitasRecebidas + totais.receitasPendentes;

  const despesasPagas = totais.despesasPagas;
  const despesasPrevistas =
    totais.despesasPagas + totais.despesasPendentes;

  const comprometimentoRealizado =
    rendaRecebida > 0
      ? formatarValor((despesasPagas / rendaRecebida) * 100)
      : null;

  const comprometimentoPrevisto =
    rendaPrevista > 0
      ? formatarValor((despesasPrevistas / rendaPrevista) * 100)
      : null;

  return {
    periodo,
    dataReferencia,

    realizado: {
      receitasRecebidas: formatarValor(rendaRecebida),
      despesasPagas: formatarValor(despesasPagas),
      percentual: comprometimentoRealizado,
    },

    previsto: {
      receitasTotais: formatarValor(rendaPrevista),
      despesasTotais: formatarValor(despesasPrevistas),
      percentual: comprometimentoPrevisto,
    },
  };
}

export async function obterEvolucaoEconomia(
  id_Usuario: number,
  periodo: PeriodoDashboard,
  dataReferencia: string = obterDataLocal(),
) {
  if (!Number.isInteger(id_Usuario) || id_Usuario <= 0) {
    throw new Error("Identificador do usuário inválido.");
  }

  const intervalo =
    periodo === "SEMANAL"
      ? obterIntervaloSemana(dataReferencia)
      : calcularIntervalo("MENSAL", dataReferencia);

  const reserva = await prisma.reservaFinanceira.findUnique({
    where: { id_Usuario },
    select: {
      valor_atual: true,
      valor_desejado: true,
      movimentacoes: {
        where: {
          data: {
            gte: intervalo.inicio,
            lt: intervalo.fim,
          },
        },
        select: {
          tipo: true,
          valor: true,
          data: true,
        },
        orderBy: {
          data: "asc",
        },
      },
    },
  });

  if (!reserva) {
    return {
      periodo,
      dataReferencia,
      possuiReserva: false,
      valorAtual: 0,
      valorDesejado: 0,
      depositos: 0,
      retiradas: 0,
      variacaoPeriodo: 0,
      percentualObjetivo: null,
      movimentacoes: [],
    };
  }

  const depositos = reserva.movimentacoes
    .filter((movimentacao) => movimentacao.tipo === "DEPOSITO")
    .reduce(
      (total, movimentacao) =>
        total + converterParaNumero(movimentacao.valor),
      0,
    );

  const retiradas = reserva.movimentacoes
    .filter((movimentacao) => movimentacao.tipo === "RETIRADA")
    .reduce(
      (total, movimentacao) =>
        total + converterParaNumero(movimentacao.valor),
      0,
    );

  const variacaoPeriodo = depositos - retiradas;

  const valorAtual = converterParaNumero(reserva.valor_atual);
  const valorDesejado = converterParaNumero(reserva.valor_desejado);

  return {
    periodo,
    dataReferencia,
    possuiReserva: true,
    valorAtual: formatarValor(valorAtual),
    valorDesejado: formatarValor(valorDesejado),
    depositos: formatarValor(depositos),
    retiradas: formatarValor(retiradas),
    variacaoPeriodo: formatarValor(variacaoPeriodo),
    percentualObjetivo:
      valorDesejado > 0
        ? formatarValor((valorAtual / valorDesejado) * 100)
        : null,
    movimentacoes: reserva.movimentacoes.map((movimentacao) => ({
      tipo: movimentacao.tipo,
      valor: formatarValor(
        converterParaNumero(movimentacao.valor),
      ),
      data: movimentacao.data,
    })),
  };
}

export async function obterResumoDividas(id_Usuario: number) {
  if (!Number.isInteger(id_Usuario) || id_Usuario <= 0) {
    throw new Error("Identificador do usuário inválido.");
  }

  const dividas = await prisma.divida.findMany({
    where: {
      id_Usuario,
    },
    select: {
      id_Divida: true,
      nome: true,
      valor_total: true,
      valor_parcela: true,
      quantidade_parcelas: true,
      parcelas_restantes: true,
      data_vencimento: true,
      taxa_juros: true,
      status: true,
    },
    orderBy: {
      data_vencimento: "asc",
    },
  });

  const dividasAtivas = dividas.filter(
    (divida) => divida.status === "ATIVA",
  );

  const dividasAtrasadas = dividas.filter(
    (divida) => divida.status === "ATRASADA",
  );

  const dividasQuitadas = dividas.filter(
    (divida) => divida.status === "QUITADA",
  );

  const calcularSaldo = (divida: (typeof dividas)[number]) =>
    divida.status === "QUITADA"
      ? 0
      : converterParaNumero(divida.valor_parcela) *
        divida.parcelas_restantes;

  const saldoDevedor = [...dividasAtivas, ...dividasAtrasadas]
    .reduce(
      (total, divida) => total + calcularSaldo(divida),
      0,
    );

  const valorTotalParcelas = dividas.reduce(
    (total, divida) =>
      total +
      converterParaNumero(divida.valor_parcela) *
        divida.quantidade_parcelas,
    0,
  );

  return {
    quantidadeTotal: dividas.length,
    quantidadeAtivas: dividasAtivas.length,
    quantidadeAtrasadas: dividasAtrasadas.length,
    quantidadeQuitadas: dividasQuitadas.length,

    saldoDevedorEstimado: formatarValor(saldoDevedor),

    valorTotalParcelas: formatarValor(valorTotalParcelas),

    dividas: dividas.map((divida) => ({
      id: divida.id_Divida,
      nome: divida.nome,
      status: divida.status,
      valorTotal: formatarValor(
        converterParaNumero(divida.valor_total),
      ),
      valorParcela: formatarValor(
        converterParaNumero(divida.valor_parcela),
      ),
      parcelasRestantes: divida.parcelas_restantes,
      saldoDevedorEstimado: formatarValor(
        calcularSaldo(divida),
      ),
      dataVencimento: divida.data_vencimento,
      taxaJuros:
        divida.taxa_juros === null
          ? null
          : converterParaNumero(divida.taxa_juros),
    })),
  };
}

export async function obterResumoPlanejamentos(id_Usuario: number) {
  if (!Number.isInteger(id_Usuario) || id_Usuario <= 0) {
    throw new Error("Identificador do usuário inválido.");
  }

  const metas = await prisma.meta.findMany({
    where: {
      id_Usuario,
      Mconfigurada: true,
      Mstatus: "EM_ANDAMENTO",
    },
    select: {
      id_Meta: true,
      Mnome: true,
      Mvalor_objetivo: true,
      Mvalor_atual: true,
      Mvalor_periodo: true,
      Mtipo: true,
      Mprioridade: true,
      Mprazo: true,
      Mmes_referencia: true,
    },
    orderBy: [
      { Mprioridade: "desc" },
      { Mprazo: "asc" },
    ],
  });

  const planejamentos = metas.map((meta) => {
    const valorObjetivo = converterParaNumero(meta.Mvalor_objetivo);
    const valorAtual = converterParaNumero(meta.Mvalor_atual);

    return {
      id: meta.id_Meta,
      nome: meta.Mnome,
      tipo: meta.Mtipo,
      prioridade: meta.Mprioridade,
      valorObjetivo: formatarValor(valorObjetivo),
      valorAtual: formatarValor(valorAtual),
      valorPeriodo:
        meta.Mvalor_periodo === null
          ? null
          : formatarValor(
              converterParaNumero(meta.Mvalor_periodo),
            ),
      percentual:
        valorObjetivo > 0
          ? formatarValor(
              Math.min((valorAtual / valorObjetivo) * 100, 100),
            )
          : null,
      prazo: meta.Mprazo,
      mesReferencia: meta.Mmes_referencia,
    };
  });

  return {
    quantidade: planejamentos.length,
    valorObjetivoTotal: formatarValor(
      planejamentos.reduce(
        (total, meta) => total + meta.valorObjetivo,
        0,
      ),
    ),
    valorAcumuladoTotal: formatarValor(
      planejamentos.reduce(
        (total, meta) => total + meta.valorAtual,
        0,
      ),
    ),
    metas: planejamentos,
  };
}

export async function obterDashboardCompleto(
  id_Usuario: number,
  periodo: PeriodoDashboard,
  dataReferencia: string = obterDataLocal(),
) {
  if (!Number.isInteger(id_Usuario) || id_Usuario <= 0) {
    throw new Error("Identificador do usuário inválido.");
  }

  if (periodo !== "SEMANAL" && periodo !== "MENSAL") {
    throw new Error("Período inválido. Utilize SEMANAL ou MENSAL.");
  }

  // Executa as estatísticas independentes em paralelo.
  const [
    comparativo,
    distribuicao,
    comprometimento,
    economia,
    dividas,
    planejamentos,
  ] = await Promise.all([
    obterComparativoDashboard(
      id_Usuario,
      periodo,
      dataReferencia,
    ),

    obterDistribuicaoDespesas(
      id_Usuario,
      periodo,
      dataReferencia,
    ),

    obterComprometimentoRenda(
      id_Usuario,
      periodo,
      dataReferencia,
    ),

    obterEvolucaoEconomia(
      id_Usuario,
      periodo,
      dataReferencia,
    ),

    obterResumoDividas(id_Usuario),

    obterResumoPlanejamentos(id_Usuario),
  ]);

  return {
    periodo,
    dataReferencia,

    resumo: comparativo.atual,

    comparativo,

    distribuicaoDespesas: distribuicao,

    comprometimentoRenda: comprometimento,

    evolucaoEconomia: economia,

    controleDividas: dividas,

    planejamentos,
  };
}
