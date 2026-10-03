import {
  DASHBOARD_MOCK,
  ESTATISTICAS_MOCK,
  EVENTOS_MES_MOCK,
  PLANOB_MOCK,
} from '../../shared/components/Mocks'
import { textoPrazo, type Meta } from '../metasData'
import type { EstatisticaResumo, EventoResumo, PlanoBResumo, PlanejamentoResumo } from './types'

const DATA_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})

export function obterProximoEvento(agora = new Date()): EventoResumo | undefined {
  const eventosFuturos = EVENTOS_MES_MOCK
    .map(evento => ({ ...evento, dataObjeto: new Date(`${evento.data}T12:00:00`) }))
    .filter(evento => evento.dataObjeto >= agora)
    .sort((a, b) => a.dataObjeto.getTime() - b.dataObjeto.getTime())

  const evento = eventosFuturos[0]
  return evento
    ? { titulo: evento.nome, data: DATA_FORMAT.format(evento.dataObjeto) }
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

// Recebe a meta que aparece no card "Planejamento" da Home (a primeira
// meta do mês em andamento, vinda do FinanceiroProvider)
export function obterPlanejamentoHome(meta?: Meta): PlanejamentoResumo | undefined {
  if (!meta) return undefined

  return {
    titulo: meta.nome,
    valor: `${textoPrazo(meta.dataLimite)} • ${meta.valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} de ${meta.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
  }
}