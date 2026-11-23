
import { api } from "./api";

export type PeriodoDashboard = "SEMANAL" | "MENSAL";

type ResumoIntervalo = {
  receitas: {
    recebidas: number;
    pendentes: number;
  };
  despesas: {
    pagas: number;
    pendentes: number;
  };
  saldoRealizado: number;
  saldoProjetado: number;
  intervalo: {
    inicio: string;
    fimExclusivo: string;
  };
};

export type ComparativoDashboard = {
  periodo: PeriodoDashboard;
  dataReferencia: string;
  atual: ResumoIntervalo;
  anterior: ResumoIntervalo;
  comparacao: {
    despesasPagas: {
      diferenca: number;
      variacaoPercentual: number | null;
    };
    receitasRecebidas: {
      diferenca: number;
      variacaoPercentual: number | null;
    };
  };
};

export type DistribuicaoDespesas = {
  periodo: PeriodoDashboard;
  dataReferencia: string;
  totalDespesasPagas: number;
  maiorGasto: {
    categoria: string;
    valor: number;
    percentual: number;
  } | null;
  categorias: {
    categoria: string;
    valor: number;
    percentual: number;
  }[];
};

export type ComprometimentoRenda = {
  periodo: PeriodoDashboard;
  dataReferencia: string;
  realizado: {
    receitasRecebidas: number;
    despesasPagas: number;
    percentual: number | null;
  };
  previsto: {
    receitasTotais: number;
    despesasTotais: number;
    percentual: number | null;
  };
};

export type EvolucaoEconomia = {
  periodo: PeriodoDashboard;
  dataReferencia: string;
  possuiReserva: boolean;
  valorAtual: number;
  valorDesejado: number;
  depositos: number;
  retiradas: number;
  variacaoPeriodo: number;
  percentualObjetivo: number | null;
  movimentacoes: {
    tipo: "DEPOSITO" | "RETIRADA";
    valor: number;
    data: string;
  }[];
};

export type ControleDividas = {
  quantidadeTotal: number;
  quantidadeAtivas: number;
  quantidadeAtrasadas: number;
  quantidadeQuitadas: number;
  saldoDevedorEstimado: number;
  valorTotalParcelas: number;
  dividas: {
    id: number;
    nome: string;
    status: "ATIVA" | "ATRASADA" | "QUITADA";
    valorTotal: number;
    valorParcela: number;
    parcelasRestantes: number;
    saldoDevedorEstimado: number;
    dataVencimento: string;
    taxaJuros: number | null;
  }[];
};

export type PlanejamentosDashboard = {
  quantidade: number;
  valorObjetivoTotal: number;
  valorAcumuladoTotal: number;
  metas: {
    id: number;
    nome: string;
    tipo: "MENSAL" | "LONGO_PRAZO";
    prioridade: string;
    valorObjetivo: number;
    valorAtual: number;
    valorPeriodo: number | null;
    percentual: number | null;
    prazo: string | null;
    mesReferencia: string | null;
  }[];
};

export type DashboardResponse = {
  periodo: PeriodoDashboard;
  dataReferencia: string;
  resumo: ResumoIntervalo;
  comparativo: ComparativoDashboard;
  distribuicaoDespesas: DistribuicaoDespesas;
  comprometimentoRenda: ComprometimentoRenda;
  evolucaoEconomia: EvolucaoEconomia;
  controleDividas: ControleDividas;
  planejamentos: PlanejamentosDashboard;
};

export async function buscarDashboardApi(
  periodo: PeriodoDashboard,
  dataReferencia?: string,
): Promise<DashboardResponse> {
  const resposta = await api.get<DashboardResponse>(
    "/dashboard",
    {
      params: {
        periodo,
        ...(dataReferencia ? { data: dataReferencia } : {}),
      },
    },
  );

  return resposta.data;
}
