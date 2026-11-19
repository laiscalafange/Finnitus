export type TipoMeta = 'mes' | 'longoPrazo'

export type StatusMeta = 'andamento' | 'concluida' | 'cancelada'

// Um depósito ou uma retirada feita numa meta (a mais recente vem primeiro)
export type MovimentacaoMeta = {
  id: string
  tipo: 'deposito' | 'retirada'
  valor: number
  // AAAA-MM-DD
  data: string
  // HH:MM
  horario: string
}

export type Meta = {
  id: string
  nome: string
  // "Meta do mês" ou "Longo prazo" (escolhido na criação)
  tipo: TipoMeta
  status: StatusMeta
  valorAtual: number
  valorTotal: number
  // DD/MM/AAAA, exatamente como foi digitado na criação (opcional)
  dataLimite?: string
  // Quando foi concluída ou cancelada (AAAA-MM-DD)
  dataFinal?: string
  // id de uma categoria de menuMais/constants (define o ícone da meta nas
  // Análises e no Histórico). Metas novas usam "outros"
  categoriaId?: string
  movimentacoes: MovimentacaoMeta[]
  configurada: boolean;
}

// ─────────────────────────────────────────────────────────────
// Ponto de partida das metas: lista vazia. Só aparecem metas que o usuário
// realmente criou (estado vive no FinanceiroProvider).
// TODO (backend): ainda não existem endpoints de metas (o schema do Prisma
// já tem Meta e MovimentacaoMeta). Quando existirem, carregar da API.
// ─────────────────────────────────────────────────────────────
export const METAS_INICIAIS: Meta[] = []

// Quanto foi guardado por mês (gráfico "Hábito de guardar" das Análises).
// O último item é o mês atual (aparece em destaque).
export type HabitoMes = {
  mes: string
  valor: number
}

// ─────────────────────────────────────────────────────────────
// Funções usadas por várias telas de Metas
// ─────────────────────────────────────────────────────────────

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// Percentual (0 a 100) já guardado de uma meta
export function percentualMeta(meta: Pick<Meta, 'valorAtual' | 'valorTotal'>): number {
  if (meta.valorTotal <= 0) return 0

  return Math.round(Math.min(100, (meta.valorAtual / meta.valorTotal) * 100))
}

// '2025-06-15' -> '15 Jun 2025'
export function formatarDataCurta(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split('-').map(Number)

  return `${String(dia).padStart(2, '0')} ${MESES[mes - 1]} ${ano}`
}

// Data de hoje em AAAA-MM-DD (data local)
export function hojeIso(): string {
  const hoje = new Date()

  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')

  return `${hoje.getFullYear()}-${mes}-${dia}`
}

// Hora de agora em HH:MM
export function agoraHorario(): string {
  const agora = new Date()

  const hora = String(agora.getHours()).padStart(2, '0')
  const minuto = String(agora.getMinutes()).padStart(2, '0')

  return `${hora}:${minuto}`
}

// Texto do prazo da meta, a partir da data limite (DD/MM/AAAA)
export function textoPrazo(dataLimite?: string): string {
  if (!dataLimite) return 'Sem data definida'

  const [dia, mes, ano] = dataLimite.split('/').map(Number)
  const limite = new Date(ano, mes - 1, dia)

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const dias = Math.round((limite.getTime() - hoje.getTime()) / 86400000)

  if (dias < 0) return 'Prazo vencido'
  if (dias === 0) return 'Vence hoje !'
  if (dias === 1) return 'Falta 1 dia !'

  return `Faltam ${dias} dias !`
}

// Quanto foi guardado nos últimos 6 meses (o último é o mês atual), calculado
// a partir dos depósitos e retiradas que o usuário realmente fez nas metas.
export function habitoGuardar(metas: Meta[], quantidadeMeses = 6): HabitoMes[] {
  const hoje = new Date()
  const meses: { chave: string; mes: string; valor: number }[] = []

  for (let i = quantidadeMeses - 1; i >= 0; i--) {
    const ref = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    const chave = `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`

    meses.push({ chave, mes: MESES[ref.getMonth()], valor: 0 })
  }

  for (const meta of metas) {
    for (const mov of meta.movimentacoes) {
      const item = meses.find(m => m.chave === mov.data.slice(0, 7))

      if (item) {
        item.valor += mov.tipo === 'deposito' ? mov.valor : -mov.valor
      }
    }
  }

  return meses.map(({ mes, valor }) => ({ mes, valor: Math.max(0, valor) }))
}