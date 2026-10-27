
import { prisma } from "../lib/prisma.js";

/*
 * Define os períodos que o dashboard poderá consultar.
 *
 * DIARIO: consulta um dia específico.
 * MENSAL: consulta um mês inteiro.
 * ANUAL: consulta um ano inteiro.
 */
type PeriodoFinanceiro = "DIARIO" | "MENSAL" | "ANUAL";

/*
 * Converte os valores Decimal do Prisma para number.
 *
 * O Prisma utiliza Decimal para valores financeiros.
 * Essa conversão permite realizar as somas e os cálculos
 * necessários para montar os indicadores do dashboard.
 */
function converterParaNumero(valor: unknown): number {
  return Number(valor);
}

/*
 * Formata os valores financeiros com duas casas decimais.
 *
 * O resultado é um número, e não uma string.
 * Exemplo: 1250.5 será retornado como 1250.5.
 */
function formatarValor(valor: number): number {
  return Number(valor.toFixed(2));
}

/*
 * Calcula o início e o fim do período consultado.
 *
 * O intervalo utiliza o início inclusivo e o fim exclusivo.
 * Isso evita problemas com horários, como registros
 * que acontecem às 23h59min59s do último dia.
 *
 * A data de referência deve estar no formato YYYY-MM-DD.
 */
function calcularIntervalo(
  periodo: PeriodoFinanceiro,
  dataReferencia: string,
): { inicio: Date; fim: Date } {
  /*
   * Confere se a data possui o formato esperado.
   */
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataReferencia)) {
    throw new Error(
      "Data de referência inválida. Utilize o formato YYYY-MM-DD.",
    );
  }

  /*
   * Separa o ano, o mês e o dia para validar
   * se a data realmente existe no calendário.
   */
  const [ano, mes, dia] = dataReferencia.split("-").map(Number);

  const inicio = new Date(Date.UTC(ano, mes - 1, dia));

  /*
   * Impede que datas inexistentes sejam normalizadas
   * automaticamente pelo JavaScript.
   */
  if (
    inicio.getUTCFullYear() !== ano ||
    inicio.getUTCMonth() !== mes - 1 ||
    inicio.getUTCDate() !== dia
  ) {
    throw new Error("A data de referência informada não existe.");
  }

  /*
   * Define o fim exclusivo de acordo com o período.
   */
  const fim = new Date(inicio);

  switch (periodo) {
    case "DIARIO":
      fim.setUTCDate(fim.getUTCDate() + 1);
      break;

    case "MENSAL":
      /*
       * Ajusta a data para o primeiro dia do mês seguinte.
       */
      fim.setUTCDate(1);
      fim.setUTCMonth(fim.getUTCMonth() + 1);
      break;

    case "ANUAL":
      /*
       * Ajusta a data para o primeiro dia do próximo ano.
       */
      fim.setUTCMonth(0, 1);
      fim.setUTCFullYear(fim.getUTCFullYear() + 1);
      break;

    default:
      throw new Error(
        "Período inválido. Utilize DIARIO, MENSAL ou ANUAL.",
      );
  }

  /*
   * Retorna as duas datas utilizadas nas consultas ao banco.
   */
  return { inicio, fim };
}

/*
 * Calcula os indicadores financeiros do dashboard.
 *
 * Parâmetros:
 * id_Usuario: identifica o usuário autenticado.
 * periodo: define se a consulta será diária, mensal ou anual.
 * dataReferencia: determina o dia, mês ou ano consultado.
 *
 * Os parâmetros de período e data possuem valores padrão,
 * permitindo consultar o mês atual sem informar uma data.
 */
export async function obterResumoFinanceiro(
  id_Usuario: number,
  periodo: PeriodoFinanceiro = "MENSAL",
  dataReferencia: string = new Date().toISOString().slice(0, 10),
) {
  /*
   * Valida o identificador antes de consultar o banco.
   */
  if (!Number.isInteger(id_Usuario) || id_Usuario <= 0) {
    throw new Error("O identificador do usuário é inválido.");
  }

  /*
   * Calcula o intervalo de datas utilizado em todas
   * as consultas financeiras desta operação.
   */
  const { inicio, fim } = calcularIntervalo(
    periodo,
    dataReferencia,
  );

  /*
   * Busca as receitas já recebidas no período.
   *
   * Somente receitas RECEBIDA entram no saldo realizado.
   * O filtro por usuário impede misturar dados de pessoas
   * diferentes no dashboard.
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
   * Busca as receitas que ainda estão pendentes.
   *
   * Elas são consideradas no saldo projetado,
   * mas não no saldo realizado.
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
   * Busca as despesas que já foram pagas no período.
   *
   * A data utilizada é data_pagamento, pois ela representa
   * quando o dinheiro efetivamente saiu.
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
   * Busca as despesas pendentes com vencimento no período.
   *
   * Essas despesas ainda não saíram do caixa, mas precisam
   * ser consideradas para estimar o saldo futuro.
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
   * Soma os valores das receitas recebidas.
   *
   * O valor inicial zero garante que a soma também funcione
   * quando nenhuma receita for encontrada.
   */
  const totalReceitasRecebidas = receitasRecebidas.reduce(
    (total, receita) => total + converterParaNumero(receita.valor),
    0,
  );

  /*
   * Soma os valores das receitas que ainda serão recebidas.
   */
  const totalReceitasPendentes = receitasPendentes.reduce(
    (total, receita) => total + converterParaNumero(receita.valor),
    0,
  );

  /*
   * Soma todas as despesas pagas dentro do período.
   */
  const totalDespesasPagas = despesasPagas.reduce(
    (total, despesa) => total + converterParaNumero(despesa.valor),
    0,
  );

  /*
   * Soma as despesas que ainda precisam ser pagas.
   */
  const totalDespesasPendentes = despesasPendentes.reduce(
    (total, despesa) => total + converterParaNumero(despesa.valor),
    0,
  );

  /*
   * Calcula o saldo realizado.
   *
   * Representa a diferença entre o dinheiro que entrou
   * e o dinheiro que saiu no período.
   */
  const saldoRealizado =
    totalReceitasRecebidas - totalDespesasPagas;

  /*
   * Calcula o saldo projetado.
   *
   * Considera as receitas pendentes e desconta
   * as despesas que ainda precisam ser pagas.
   */
  const saldoProjetado =
    saldoRealizado +
    totalReceitasPendentes -
    totalDespesasPendentes;

  /*
   * Retorna os indicadores que poderão ser utilizados
   * pelo controller e enviados ao frontend do dashboard.
   *
   * O início é inclusivo e o fim é exclusivo.
   */
  return {
    periodo,
    dataReferencia,
    intervalo: {
      inicio: inicio.toISOString().slice(0, 10),
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
