import { Package, type LucideIcon } from 'lucide-react-native'
import { CATEGORIAS_POR_ID } from '../menuMais/constants'
import type { Transacao } from '../financeiroContext'

// ─────────────────────────────────────────────────────────────
// Contas fixas (despesas e receitas que se repetem todo mês) e gastos
// avulsos. Tudo aqui são funções puras: recebem os dados do
// FinanceiroProvider e devolvem o que as telas precisam mostrar.
// ─────────────────────────────────────────────────────────────

// Mês de uma conta, no formato AAAA-MM (ex.: "2026-10")
export type Competencia = string

// Como a receita foi/será recebida (campo "Tipo de recebimento")
export type TipoRecebimento = 'integral' | 'parcial' | 'adiantamento'

// Os dados de uma conta que podem mudar de um mês pra outro
export type VersaoConta = {
  nome: string
  valor: number
  // Dia do mês em que vence / é recebida
  dia: number
  observacao?: string
  tipoRecebimento?: TipoRecebimento
}

// Edição de uma conta fixa: vale a partir de um mês ("desde") e nunca muda
// os meses anteriores
export type VigenciaConta = {
  desde: Competencia
  dados: VersaoConta
  // ISO, usado pra avisar sobre alterações recentes
  alteradaEm: string
}

// Pagamento ou recebimento confirmado pela pessoa (o histórico financeiro).
// O valor previsto fica guardado junto, separado do valor realizado.
export type Baixa = {
  id: string
  transacaoId: string
  competencia: Competencia
  // DD/MM/AAAA
  dataRealizada: string
  valorPrevisto: number
  valorRealizado: number
  // ISO
  registradaEm: string
}

export type StatusConta = 'pendente' | 'emDia' | 'atrasada' | 'paga' | 'recebida'

// Uma conta (fixa ou avulsa) em um mês específico
export type ContaDoMes = {
  transacaoId: string
  competencia: Competencia
  tipo: 'gasto' | 'entrada'
  // true = conta fixa (repete todo mês); false = gasto/entrada avulsa
  recorrente: boolean
  nome: string
  categoriaId: string
  icone: LucideIcon
  valorPrevisto: number
  // Só existe depois que a pessoa confirma o pagamento/recebimento
  valorRealizado?: number
  // DD/MM/AAAA
  dataVencimento: string
  dataRealizada?: string
  // Dias até o vencimento (negativo = já passou)
  diasParaVencer: number
  status: StatusConta
  observacao?: string
  tipoRecebimento?: TipoRecebimento
  baixa?: Baixa
}

// ─────────────────────────────────────────────────────────────
// Datas
// ─────────────────────────────────────────────────────────────

const MESES_LONGOS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

// "10/10/2026" -> { dia: 10, mes: 9, ano: 2026 } (mes de 0 a 11)
export function partesData(texto: string) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto)
  if (!partes) return undefined

  return { dia: Number(partes[1]), mes: Number(partes[2]) - 1, ano: Number(partes[3]) }
}

export function competenciaDe(mes: number, ano: number): Competencia {
  return `${ano}-${String(mes + 1).padStart(2, '0')}`
}

export function partesCompetencia(competencia: Competencia) {
  const [ano, mes] = competencia.split('-').map(Number)
  return { mes: mes - 1, ano }
}

export function competenciaAtual(hoje = new Date()): Competencia {
  return competenciaDe(hoje.getMonth(), hoje.getFullYear())
}

export function competenciaDaData(texto: string): Competencia {
  const data = partesData(texto)!
  return competenciaDe(data.mes, data.ano)
}

export function competenciaSeguinte(competencia: Competencia): Competencia {
  const { mes, ano } = partesCompetencia(competencia)
  return mes === 11 ? competenciaDe(0, ano + 1) : competenciaDe(mes + 1, ano)
}

export function competenciaAnterior(competencia: Competencia): Competencia {
  const { mes, ano } = partesCompetencia(competencia)
  return mes === 0 ? competenciaDe(11, ano - 1) : competenciaDe(mes - 1, ano)
}

// "2026-10" -> "Outubro 2026"
export function nomeCompetencia(competencia: Competencia): string {
  const { mes, ano } = partesCompetencia(competencia)
  const nome = MESES_LONGOS[mes]
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)} ${ano}`
}

// "2026-10" -> "outubro de 2026"
export function mesPorExtenso(competencia: Competencia): string {
  const { mes, ano } = partesCompetencia(competencia)
  return `${MESES_LONGOS[mes]} de ${ano}`
}

// "10/10/2026" -> "10 de outubro de 2026"
export function dataPorExtenso(texto: string): string {
  const data = partesData(texto)
  if (!data) return texto
  return `${data.dia} de ${MESES_LONGOS[data.mes]} de ${data.ano}`
}

function diasNoMes(competencia: Competencia): number {
  const { mes, ano } = partesCompetencia(competencia)
  return new Date(ano, mes + 1, 0).getDate()
}

function paraDate(texto: string): Date {
  const data = partesData(texto)!
  return new Date(data.ano, data.mes, data.dia)
}

// Dias de "hoje" até a data (negativo = a data já passou)
export function diasAte(texto: string, hoje = new Date()): number {
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  return Math.round((paraDate(texto).getTime() - inicioHoje.getTime()) / 86400000)
}

// 0 -> "Hoje", 1 -> "Amanhã", 3 -> "Em 3 dias", -2 -> "Há 2 dias"
export function descreverPrazo(dias: number): string {
  if (dias === 0) return 'Hoje'
  if (dias === 1) return 'Amanhã'
  if (dias > 1) return `Em ${dias} dias`
  if (dias === -1) return 'Ontem'
  return `Há ${Math.abs(dias)} dias`
}

// ─────────────────────────────────────────────────────────────
// Contas
// ─────────────────────────────────────────────────────────────

// Nome mostrado: a descrição digitada ou, se não houver, o nome da categoria
export function nomeDaTransacao(transacao: Transacao): string {
  return (
    transacao.descricao?.trim() ||
    CATEGORIAS_POR_ID[transacao.categoriaId]?.rotulo ||
    (transacao.tipo === 'gasto' ? 'Despesa' : 'Receita')
  )
}

// Os dados da conta valendo em um mês (aplica as edições feitas até ali)
export function versaoNoMes(transacao: Transacao, competencia: Competencia): VersaoConta {
  const inicio = partesData(transacao.data)

  let versao: VersaoConta = {
    nome: nomeDaTransacao(transacao),
    valor: transacao.valor,
    dia: inicio?.dia ?? 1,
    observacao: transacao.observacao,
    tipoRecebimento: transacao.tipoRecebimento,
  }

  for (const vigencia of transacao.vigencias ?? []) {
    if (vigencia.desde <= competencia) versao = vigencia.dados
  }

  return versao
}

// A transação acontece nesse mês? Conta fixa: do mês em que começou até o
// mês em que foi encerrada. Avulsa: só no mês da data.
export function ocorreNoMes(transacao: Transacao, competencia: Competencia): boolean {
  if (!partesData(transacao.data)) return false

  const inicio = competenciaDaData(transacao.data)

  if (!transacao.repetirMensalmente) return inicio === competencia

  return inicio <= competencia && (!transacao.ate || competencia <= transacao.ate)
}

// Até quantos dias antes do vencimento a conta vira "Pendente"
export const DIAS_LEMBRETE = 7

export function contaDoMes(
  transacao: Transacao,
  baixas: Baixa[],
  competencia: Competencia,
  hoje = new Date(),
): ContaDoMes | undefined {
  if (!ocorreNoMes(transacao, competencia)) return undefined

  const versao = versaoNoMes(transacao, competencia)
  const { mes, ano } = partesCompetencia(competencia)

  // Conta avulsa usa a data digitada; conta fixa usa o dia do mês (mês curto
  // vence no último dia)
  const dia = transacao.repetirMensalmente
    ? Math.min(versao.dia, diasNoMes(competencia))
    : partesData(transacao.data)!.dia

  const dataVencimento = `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`
  const diasParaVencer = diasAte(dataVencimento, hoje)
  const baixa = baixas.find(
    (item) => item.transacaoId === transacao.id && item.competencia === competencia,
  )

  let status: StatusConta
  let valorRealizado: number | undefined
  let dataRealizada: string | undefined

  if (!transacao.repetirMensalmente) {
    // Gasto/entrada avulsa: já aconteceu quando foi registrada
    status = transacao.tipo === 'gasto' ? 'paga' : 'recebida'
    valorRealizado = transacao.valor
    dataRealizada = transacao.data
  } else if (baixa) {
    status = transacao.tipo === 'gasto' ? 'paga' : 'recebida'
    valorRealizado = baixa.valorRealizado
    dataRealizada = baixa.dataRealizada
  } else if (diasParaVencer < 0) {
    status = 'atrasada'
  } else if (diasParaVencer <= DIAS_LEMBRETE) {
    status = 'pendente'
  } else {
    status = 'emDia'
  }

  return {
    transacaoId: transacao.id,
    competencia,
    tipo: transacao.tipo,
    recorrente: transacao.repetirMensalmente,
    nome: versao.nome,
    categoriaId: transacao.categoriaId,
    icone: CATEGORIAS_POR_ID[transacao.categoriaId]?.icone ?? Package,
    valorPrevisto: versao.valor,
    valorRealizado,
    dataVencimento,
    dataRealizada,
    diasParaVencer,
    status,
    observacao: versao.observacao,
    tipoRecebimento: versao.tipoRecebimento,
    baixa,
  }
}

// Todas as contas (fixas e avulsas) de um mês, na ordem do dia
export function contasDoMes(
  transacoes: Transacao[],
  baixas: Baixa[],
  competencia: Competencia,
  hoje = new Date(),
): ContaDoMes[] {
  return transacoes
    .map((transacao) => contaDoMes(transacao, baixas, competencia, hoje))
    .filter((conta): conta is ContaDoMes => conta !== undefined)
    .sort((a, b) => a.dataVencimento.split('/').reverse().join('').localeCompare(
      b.dataVencimento.split('/').reverse().join(''),
    ))
}

// Só as contas fixas do mês
export function contasFixasDoMes(
  transacoes: Transacao[],
  baixas: Baixa[],
  competencia: Competencia,
  hoje = new Date(),
): ContaDoMes[] {
  return contasDoMes(transacoes, baixas, competencia, hoje).filter((conta) => conta.recorrente)
}

// Conta ainda sem pagamento/recebimento confirmado
export function estaAberta(conta: ContaDoMes): boolean {
  return conta.status === 'pendente' || conta.status === 'emDia' || conta.status === 'atrasada'
}

// Valor que entra nos saldos: o realizado, se já foi confirmado; senão o previsto
export function valorEfetivo(conta: ContaDoMes): number {
  return conta.valorRealizado ?? conta.valorPrevisto
}

// Diferença entre o que foi pago/recebido e o previsto (0 se igual ou sem baixa)
export function diferencaDaConta(conta: ContaDoMes): number {
  if (conta.valorRealizado === undefined) return 0
  return Math.round((conta.valorRealizado - conta.valorPrevisto) * 100) / 100
}

// Texto do status (sempre escrito, nunca só cor)
export function rotuloStatus(conta: ContaDoMes): string {
  switch (conta.status) {
    case 'paga':
      return 'Paga'
    case 'recebida':
      return conta.tipo === 'entrada' && diferencaDaConta(conta) < 0 ? 'Recebida (parcial)' : 'Recebida'
    case 'atrasada':
      return 'Atrasada'
    case 'pendente':
      return 'Pendente'
    default:
      return 'Em dia'
  }
}

// "Vencimento" pras despesas, "Recebimento" pras receitas
export function rotuloData(conta: Pick<ContaDoMes, 'tipo'>): string {
  return conta.tipo === 'gasto' ? 'Vencimento' : 'Recebimento'
}

// "10/10/2026" -> "10/10"
export function diaMes(texto: string): string {
  return texto.slice(0, 5)
}