import {
  DASHBOARD_MOCK,
  ESTATISTICAS_MOCK,
  PLANOB_MOCK,
} from '../../shared/components/Mocks'
import { percentualMeta, type Meta } from '../metasData'
import { valorEfetivo, type Competencia, type ContaDoMes } from '../contas/contasData'
import type {
  EconomiaResumo,
  EstatisticaResumo,
  EventoResumo,
  PlanoBResumo,
  PlanejamentoResumo,
  ResumoMes,
} from './types'

// "21 de dezembro"
const DATA_EVENTO_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
})

export function obterProximoEvento(eventos: Array<{ nome: string; data: string }>, agora = new Date()): EventoResumo | undefined {
  const eventosFuturos = eventos
    .map(evento => ({ ...evento, dataObjeto: new Date(`${evento.data}T12:00:00`) }))
    .filter(evento => evento.dataObjeto >= agora)
    .sort((a, b) => a.dataObjeto.getTime() - b.dataObjeto.getTime())

  const evento = eventosFuturos[0]
  return evento
    ? { titulo: evento.nome, data: DATA_EVENTO_FORMAT.format(evento.dataObjeto) }
    : undefined
}

export function obterEstatisticasHome(): EstatisticaResumo[] {
  return DASHBOARD_MOCK.estatisticas.semanaAtual.map((valor, index) => ({
    dia: ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'][index],
    receitas: ESTATISTICAS_MOCK.semanaAtual[index] ?? valor,
    despesas: ESTATISTICAS_MOCK.semanaPassada[index] ?? 0,
  }))
}

export function obterPlanoBResumo(salario?: number, despesas?: number): PlanoBResumo {
  if (salario !== undefined && despesas !== undefined) {
    return {
      nome: PLANOB_MOCK.status,
      valorAtual: despesas,
      valorMeta: salario,
    }
  }

  const valorMeta = PLANOB_MOCK.limite
  const restanteExistente = DASHBOARD_MOCK.planoB.restante

  return {
    nome: DASHBOARD_MOCK.planoB.status,
    valorAtual: Math.max(0, valorMeta - restanteExistente),
    valorMeta,
  }
}

// Recebe a meta que aparece no card "Metas" da Home (a primeira meta do mês
// em andamento; se não houver, a primeira de longo prazo)
export function obterPlanejamentoHome(meta?: Meta): PlanejamentoResumo | undefined {
  if (!meta) return undefined

  return {
    titulo: meta.nome,
    percentual: percentualMeta(meta),
    faltam: Math.max(0, meta.valorTotal - meta.valorAtual),
    total: meta.valorTotal,
  }
}

// ─────────────────────────────────────────────────────────────
// Funções de mês (receitas, despesas e economia)
// ─────────────────────────────────────────────────────────────

// Receitas, despesas e saldo do mês. Salário e despesas da configuração
// inicial valem todo mês; as contas (fixas e avulsas) entram no mês delas. Conta
// já paga/recebida entra pelo valor realizado; as demais, pelo previsto.
export function obterResumoMes(
  contas: ContaDoMes[],
  salario: number | undefined,
  despesasBase: number | undefined,
  temTransacoes: boolean,
): ResumoMes {
  if (salario === undefined && despesasBase === undefined && !temTransacoes) return {}

  const total = (tipo: ContaDoMes['tipo']) =>
    contas
      .filter((conta) => conta.tipo === tipo)
      .reduce((soma, conta) => soma + valorEfetivo(conta), 0)

  const receitas = (salario ?? 0) + total('entrada')
  const despesas = (despesasBase ?? 0) + total('gasto')

  return { receitas, despesas, saldo: receitas - despesas }
}

// Quanto foi guardado nas metas no mês (depósitos - retiradas) e quanto isso
// representa das receitas do mês
export function obterEconomiaMes(
  metas: Meta[],
  receitas: number | undefined,
  competencia: Competencia,
  economiaFutura?: number,
  tempoEconomia?: number,
): EconomiaResumo {
  // Soma em centavos pra não errar por arredondamento
  let centavos = 0
  for (const meta of metas) {
    for (const movimentacao of meta.movimentacoes) {
      if (!movimentacao.data.startsWith(competencia)) continue
      const valor = Math.round(movimentacao.valor * 100)
      centavos += movimentacao.tipo === 'deposito' ? valor : -valor
    }
  }

  const economizado = Math.max(0, centavos / 100)

  return {
    economizado,
    percentual: receitas && receitas > 0 ? Math.min(100, (economizado / receitas) * 100) : 0,
    metaMensal:
      economiaFutura !== undefined && tempoEconomia !== undefined && tempoEconomia > 0
        ? economiaFutura / tempoEconomia
        : undefined,
  }
}