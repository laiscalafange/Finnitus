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
}

// ─────────────────────────────────────────────────────────────
// Dados de exemplo (os mesmos do protótipo). Eles só servem de ponto de
// partida: o estado das metas vive no FinanceiroProvider.
// TODO (backend): ainda não existem endpoints de metas (o schema do Prisma
// já tem Meta e MovimentacaoMeta). Quando existirem, carregar da API.
// ─────────────────────────────────────────────────────────────
export const METAS_INICIAIS: Meta[] = [
  // Metas do mês
  { id: 'm1', nome: 'Presente', tipo: 'mes', status: 'andamento', valorAtual: 80, valorTotal: 100, dataLimite: '14/10/2026', categoriaId: 'presentes', movimentacoes: [] },
  { id: 'm2', nome: 'Bolsa nova', tipo: 'mes', status: 'andamento', valorAtual: 1500, valorTotal: 4500, categoriaId: 'vestuario', movimentacoes: [] },
  { id: 'm3', nome: 'Batedeira', tipo: 'mes', status: 'andamento', valorAtual: 200, valorTotal: 1200, dataLimite: '21/11/2026', categoriaId: 'alimentacao', movimentacoes: [] },

  // Metas de longo prazo
  { id: 'l1', nome: 'Carro novo', tipo: 'longoPrazo', status: 'andamento', valorAtual: 15420, valorTotal: 45000, categoriaId: 'transporte', movimentacoes: [] },
  { id: 'l2', nome: 'Viagem nova', tipo: 'longoPrazo', status: 'andamento', valorAtual: 4000, valorTotal: 10000, categoriaId: 'viagem', movimentacoes: [] },
  { id: 'l3', nome: 'Casa nova', tipo: 'longoPrazo', status: 'andamento', valorAtual: 9500, valorTotal: 50000, categoriaId: 'moradia', movimentacoes: [] },

  // Já finalizadas (aparecem no Histórico)
  { id: 'h1', nome: 'Tênis novo', tipo: 'mes', status: 'concluida', valorAtual: 850, valorTotal: 850, dataFinal: '2025-06-15', categoriaId: 'vestuario', movimentacoes: [] },
  { id: 'h2', nome: 'Curso online', tipo: 'mes', status: 'concluida', valorAtual: 297, valorTotal: 297, dataFinal: '2025-05-03', categoriaId: 'educacao', movimentacoes: [] },
  { id: 'h3', nome: 'Fone Bluetooth', tipo: 'mes', status: 'concluida', valorAtual: 450, valorTotal: 450, dataFinal: '2025-04-10', categoriaId: 'lazer', movimentacoes: [] },
  { id: 'h4', nome: 'Tablet', tipo: 'longoPrazo', status: 'cancelada', valorAtual: 200, valorTotal: 1800, dataFinal: '2025-03-28', categoriaId: 'outros', movimentacoes: [] },
]

// Quanto foi guardado por mês (gráfico "Hábito de guardar" das Análises).
// O último item é o mês atual (aparece em destaque).
export type HabitoMes = {
  mes: string
  valor: number
}

export const HABITO_GUARDAR: HabitoMes[] = [
  { mes: 'Jan', valor: 460 },
  { mes: 'Fev', valor: 640 },
  { mes: 'Mar', valor: 540 },
  { mes: 'Abr', valor: 800 },
  { mes: 'Mai', valor: 1000 },
  { mes: 'Jun', valor: 1180 },
]

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