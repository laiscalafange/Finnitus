export type Meta = {
  id: string
  nome: string
  prazo: string
  data?: string
  valorAtual: number
  valorTotal: number
  // id de uma categoria de menuMais/constants (define o ícone da meta)
  categoriaId: string
}

export const METAS_DO_MES: Meta[] = [
  {
    id: '1',
    nome: 'Presente',
    prazo: 'Faltam 12 dias !',
    data: '03/06',
    valorAtual: 80,
    valorTotal: 100,
    categoriaId: 'presentes',
  },
  {
    id: '2',
    nome: 'Bolsa nova',
    prazo: 'Sem data definida',
    valorAtual: 1500,
    valorTotal: 4500,
    categoriaId: 'vestuario',
  },
  {
    id: '3',
    nome: 'Batedeira',
    prazo: 'Sem data definida',
    data: '21/06',
    valorAtual: 200,
    valorTotal: 1200,
    categoriaId: 'alimentacao',
  },
]

export type MetaLongoPrazo = {
  id: string
  nome: string
  valorAtual: number
  valorTotal: number
  categoriaId: string
}

export const METAS_LONGO_PRAZO: MetaLongoPrazo[] = [
  { id: '1', nome: 'Carro\nnovo', valorAtual: 15420, valorTotal: 45000, categoriaId: 'transporte' },
  { id: '2', nome: 'Viagem\nnova', valorAtual: 4000, valorTotal: 10000, categoriaId: 'viagem' },
  { id: '3', nome: 'Casa\nnova', valorAtual: 9500, valorTotal: 50000, categoriaId: 'moradia' },
]

// ─────────────────────────────────────────────────────────────
// Histórico e Análises de Metas
// TODO (backend): ainda não existem endpoints de metas. Estes dados são de
// exemplo (os mesmos do protótipo) e devem vir da API quando ela existir.
// ─────────────────────────────────────────────────────────────

// Metas já concluídas ou canceladas (tela Histórico), da mais recente pra mais antiga
export type MetaFinalizada = {
  id: string
  nome: string
  categoriaId: string
  status: 'concluida' | 'cancelada'
  // Quanto tinha sido guardado
  valor: number
  // Quando foi concluída ou cancelada
  data: string
}

export const METAS_FINALIZADAS: MetaFinalizada[] = [
  { id: 'h1', nome: 'Tênis novo', categoriaId: 'vestuario', status: 'concluida', valor: 850, data: '15 Jun 2025' },
  { id: 'h2', nome: 'Curso online', categoriaId: 'educacao', status: 'concluida', valor: 297, data: '03 Mai 2025' },
  { id: 'h3', nome: 'Fone Bluetooth', categoriaId: 'lazer', status: 'concluida', valor: 450, data: '10 Abr 2025' },
  { id: 'h4', nome: 'Tablet', categoriaId: 'outros', status: 'cancelada', valor: 200, data: '28 Mar 2025' },
]

// Quanto foi guardado por mês (gráfico "Hábito de guardar").
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