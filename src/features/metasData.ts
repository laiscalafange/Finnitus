export type Meta = {
  id: string
  nome: string
  prazo: string
  data?: string
  valorAtual: number
  valorTotal: number
}

export const METAS_DO_MES: Meta[] = [
  {
    id: '1',
    nome: 'Presente',
    prazo: 'Faltam 12 dias !',
    data: '03/06',
    valorAtual: 80,
    valorTotal: 100,
  },
  {
    id: '2',
    nome: 'Bolsa nova',
    prazo: 'Sem data definida',
    valorAtual: 1000,
    valorTotal: 4500,
  },
  {
    id: '3',
    nome: 'Batedeira',
    prazo: 'Sem data definida',
    data: '21/06',
    valorAtual: 200,
    valorTotal: 1200,
  },
]

export const METAS_LONGO_PRAZO = [
  { id: '1', nome: 'Carro\nnovo' },
  { id: '2', nome: 'Viagem\nnova' },
  { id: '3', nome: 'Casa\nnova' },
]
