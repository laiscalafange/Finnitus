export type EventoResumo = {
  titulo: string
  data: string
}

export type EstatisticaResumo = {
  dia: string
  receitas: number
  despesas: number
}

export type PlanoBResumo = {
  nome: string
  valorAtual: number
  valorMeta: number
}

export type PlanejamentoResumo = {
  titulo: string
  valor: string
}

export type EconomiaResumo = {
  economiaFutura: number
  tempoEconomia: number
  economiaMensal: number
  percentualMeta: number
}
