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
  // Dias com fundo verde (AAAA-MM-DD, data local), ex.: prazo das metas
  diasMarcados?: string[]
  aoSelecionarDia?: (data: Date) => void
  aoPressCoroa?: () => void
  aoPressSino?: () => void
}