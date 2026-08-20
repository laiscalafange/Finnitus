export interface DiaSemana {
  data: Date
  letra: string
  numero: string
  chave: string
}

export interface CalendarioSemanaProps {
  titulo: string
  subtitulo?: string
  dataInicial?: Date
  mostrarSeta?: boolean
  mostrarAcoes?: boolean
  aoSelecionarDia?: (data: Date) => void
  aoPressCoroa?: () => void
  aoPressSino?: () => void
  aoPressAdicionar?: () => void
  aoPressEditar?: () => void
}