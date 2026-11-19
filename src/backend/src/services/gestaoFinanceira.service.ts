
import { prisma } from "../lib/prisma.js";

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
 * Obtém a data atual no formato YYYY-MM-DD,
 * utilizando a data local do servidor.
 *
 * Isso evita que o dia de referência mude por causa
 * da conversão automática para UTC do toISOString().
 */
function obterDataLocal(): string {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

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
  dataReferencia: string = obterDataLocal(),
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

  /*
   * Consulta as receitas já recebidas no período.
   *
   * O filtro id_Usuario garante que somente as receitas
   * pertencentes ao usuário autenticado sejam consideradas.
   *
   * A data utilizada é data_recebimento.
   */
  const receitasRecebidas = await prisma.receita.findMany({
    where: {
      id_Usuario,
      status: "RECEBIDA",
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
   * Consulta as despesas que já foram pagas no período.
   *
   * Utiliza data_pagamento, pois ela representa
   * quando a despesa foi efetivamente paga.
   *
   * Despesas sem data_pagamento não entram nesta consulta.
   */
  const despesasPagas = await prisma.despesa.findMany({
    where: {
      id_Usuario,
      status: "PAGA",
      data_pagamento: {
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
   * Soma somente as receitas recebidas.
   *
   * O valor inicial zero permite que o cálculo funcione
   * mesmo quando a consulta não encontrar registros.
   */
  const totalReceitasRecebidas = receitasRecebidas.reduce(
    (total, receita) =>
      total + converterParaNumero(receita.valor),
    0,
  );

  /*
   * Soma as receitas que ainda estão pendentes.
   */
  const totalReceitasPendentes = receitasPendentes.reduce(
    (total, receita) =>
      total + converterParaNumero(receita.valor),
    0,
  );

  /*
   * Soma as despesas efetivamente pagas no período.
   */
  const totalDespesasPagas = despesasPagas.reduce(
    (total, despesa) =>
      total + converterParaNumero(despesa.valor),
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
    obterDataLocal(),
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
  dataReferencia: string = obterDataLocal(),
) {
  return obterResumoFinanceiro(
    id_Usuario,
    periodo,
    dataReferencia,
  );
}
