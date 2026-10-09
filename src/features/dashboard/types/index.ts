import type { LucideIcon } from 'lucide-react-native'

export type EventoResumo = {
  titulo: string
  // Já formatada para a tela (ex.: "21 de dezembro")
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

// Meta que aparece no card "Metas" da Home
// (o nome do tipo é antigo; na interface o card se chama "Metas")
export type PlanejamentoResumo = {
  titulo: string
  // 0 a 100
  percentual: number
  // Quanto ainda falta guardar e o valor total da meta
  faltam: number
  total: number
}

// Economia do mês selecionado (quanto foi guardado nas metas)
export type EconomiaResumo = {
  // Guardado nas metas no mês (depósitos - retiradas, nunca negativo)
  economizado: number
  // Quanto isso representa das receitas do mês (0 a 100)
  percentual: number
  // Meta mensal informada na configuração inicial (opcional)
  metaMensal?: number
}

// Receitas, despesas e saldo do mês selecionado
export type ResumoMes = {
  receitas?: number
  despesas?: number
  saldo?: number
  // Variação em % contra o mês anterior (só existe se o mês anterior tinha valor)
  variacaoReceitas?: number
  variacaoDespesas?: number
}

// Despesa que se repete todo mês (gasto marcado com "repetir mensalmente")
export type DespesaFixaResumo = {
  id: string
  titulo: string
  // Dia do mês em que vence e texto DD/MM do mês selecionado
  dia: number
  vencimento: string
  valor: number
  icone: LucideIcon
}

export type AlertaResumo = {
  id: string
  titulo: string
  descricao: string
  icone: LucideIcon
}