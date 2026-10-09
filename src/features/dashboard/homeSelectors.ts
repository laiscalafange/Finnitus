import { Package } from 'lucide-react-native'
import {
  DASHBOARD_MOCK,
  ESTATISTICAS_MOCK,
  EVENTOS_MES_MOCK,
  PLANOB_MOCK,
} from '../../shared/components/Mocks'
import { CATEGORIAS_POR_ID } from '../menuMais/constants'
import { percentualMeta, type Meta } from '../metasData'
import type { Transacao } from '../financeiroContext'
import type {
  AlertaResumo,
  DespesaFixaResumo,
  EconomiaResumo,
  EstatisticaResumo,
  EventoResumo,
  PlanoBResumo,
  PlanejamentoResumo,
  ResumoMes,
} from './types'

// Mês (0 = janeiro ... 11 = dezembro) e ano que a Home está mostrando
export type MesAno = { mes: number; ano: number }

// "21 de dezembro"
const DATA_EVENTO_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
})

export function obterProximoEvento(agora = new Date()): EventoResumo | undefined {
  const eventosFuturos = EVENTOS_MES_MOCK
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
// Funções de mês (receitas, despesas, despesas fixas, avisos, economia)
// ─────────────────────────────────────────────────────────────

// "15/09/2026" -> { dia: 15, mes: 8, ano: 2026 }
function partesData(texto: string) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto)
  if (!partes) return undefined

  return { dia: Number(partes[1]), mes: Number(partes[2]) - 1, ano: Number(partes[3]) }
}

const indiceMes = ({ mes, ano }: MesAno) => ano * 12 + mes

const diasNoMes = ({ mes, ano }: MesAno) => new Date(ano, mes + 1, 0).getDate()

function mesAnterior({ mes, ano }: MesAno): MesAno {
  return mes === 0 ? { mes: 11, ano: ano - 1 } : { mes: mes - 1, ano }
}

// Uma transação conta no mês se foi feita nele ou se se repete todo mês e
// começou antes (ou no próprio mês)
function transacaoNoMes(transacao: Transacao, referencia: MesAno): boolean {
  const data = partesData(transacao.data)
  if (!data) return false

  if (data.ano === referencia.ano && data.mes === referencia.mes) return true

  return transacao.repetirMensalmente && indiceMes(data) < indiceMes(referencia)
}

// Salário e despesas da configuração inicial valem todo mês; as transações
// do "Novo gasto" entram no mês em que aconteceram (ou se repetem)
function totaisDoMes(
  transacoes: Transacao[],
  salario: number | undefined,
  despesasBase: number | undefined,
  referencia: MesAno,
) {
  const doMes = transacoes.filter(transacao => transacaoNoMes(transacao, referencia))
  const somar = (tipo: Transacao['tipo']) =>
    doMes.filter(transacao => transacao.tipo === tipo).reduce((total, t) => total + t.valor, 0)

  return {
    receitas: (salario ?? 0) + somar('entrada'),
    despesas: (despesasBase ?? 0) + somar('gasto'),
  }
}

// Variação em % (só dá pra calcular se o mês anterior tinha valor)
function variacao(atual: number, anterior: number): number | undefined {
  return anterior > 0 ? Math.round(((atual - anterior) / anterior) * 100) : undefined
}

export function obterResumoMes(
  transacoes: Transacao[],
  salario: number | undefined,
  despesasBase: number | undefined,
  referencia: MesAno,
): ResumoMes {
  const temDados = salario !== undefined || despesasBase !== undefined || transacoes.length > 0
  if (!temDados) return {}

  const atual = totaisDoMes(transacoes, salario, despesasBase, referencia)
  const anterior = totaisDoMes(transacoes, salario, despesasBase, mesAnterior(referencia))

  return {
    receitas: atual.receitas,
    despesas: atual.despesas,
    saldo: atual.receitas - atual.despesas,
    variacaoReceitas: variacao(atual.receitas, anterior.receitas),
    variacaoDespesas: variacao(atual.despesas, anterior.despesas),
  }
}

// Gastos marcados com "repetir mensalmente" no Novo gasto, ordenados pelo
// dia do vencimento. O ícone é o mesmo da categoria do Novo gasto.
export function obterDespesasFixas(
  transacoes: Transacao[],
  referencia: MesAno,
): DespesaFixaResumo[] {
  return transacoes
    .filter(
      transacao =>
        transacao.tipo === 'gasto' &&
        transacao.repetirMensalmente &&
        transacaoNoMes(transacao, referencia),
    )
    .map(transacao => {
      const data = partesData(transacao.data)!
      const categoria = CATEGORIAS_POR_ID[transacao.categoriaId]
      // Mês com menos dias (ex.: dia 31 em fevereiro) vence no último dia
      const dia = Math.min(data.dia, diasNoMes(referencia))

      return {
        id: transacao.id,
        titulo: transacao.descricao?.trim() || categoria?.rotulo || 'Despesa fixa',
        dia,
        vencimento: `${String(dia).padStart(2, '0')}/${String(referencia.mes + 1).padStart(2, '0')}`,
        valor: transacao.valor,
        icone: categoria?.icone ?? Package,
      }
    })
    .sort((a, b) => a.dia - b.dia)
}

// Avisos: despesa fixa que vence hoje, amanhã ou nos próximos 3 dias (só no
// mês atual)
export function obterAlertas(
  despesasFixas: DespesaFixaResumo[],
  referencia: MesAno,
  hoje = new Date(),
): AlertaResumo[] {
  if (referencia.mes !== hoje.getMonth() || referencia.ano !== hoje.getFullYear()) return []

  return despesasFixas.flatMap(despesa => {
    const falta = despesa.dia - hoje.getDate()
    if (falta < 0 || falta > 3) return []

    const quando =
      falta === 0 ? 'vence hoje' : falta === 1 ? 'vence amanhã' : `vence em ${falta} dias`

    return [
      {
        id: despesa.id,
        titulo: `${despesa.titulo} ${quando}`,
        descricao: 'Verifique se o pagamento já foi realizado.',
        icone: despesa.icone,
      },
    ]
  })
}

// Quanto foi guardado nas metas no mês (depósitos - retiradas) e quanto isso
// representa das receitas do mês
export function obterEconomiaMes(
  metas: Meta[],
  receitas: number | undefined,
  referencia: MesAno,
  economiaFutura?: number,
  tempoEconomia?: number,
): EconomiaResumo {
  const prefixo = `${referencia.ano}-${String(referencia.mes + 1).padStart(2, '0')}`

  // Soma em centavos pra não errar por arredondamento
  let centavos = 0
  for (const meta of metas) {
    for (const movimentacao of meta.movimentacoes) {
      if (!movimentacao.data.startsWith(prefixo)) continue
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