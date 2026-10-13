import { EVENTOS_MES_MOCK } from '../../shared/components/Mocks'
import { formatarMoeda } from '../menuMais/utils'
import { percentualMeta, type Meta } from '../metasData'
import type { Transacao } from '../financeiroContext'
import {
  competenciaAnterior,
  competenciaAtual,
  competenciaSeguinte,
  contaDoMes,
  contasFixasDoMes,
  dataPorExtenso,
  descreverPrazo,
  diasAte,
  diaMes,
  estaAberta,
  mesPorExtenso,
  versaoNoMes,
  type Baixa,
  type ContaDoMes,
  type Competencia,
} from './contasData'

// ─────────────────────────────────────────────────────────────
// Central de notificações. Nada é guardado: as notificações são calculadas
// a cada abertura a partir das contas, metas e eventos. Por isso, uma conta
// que a pessoa marca como paga/recebida deixa de aparecer sozinha.
// ─────────────────────────────────────────────────────────────

export type CategoriaNotificacao = 'contas' | 'metas' | 'eventos'

export type Notificacao = {
  // O id muda quando a situação muda (lembrete -> atraso), então a notificação
  // volta a aparecer como não lida
  id: string
  categoria: CategoriaNotificacao
  // Define o ícone no CardNotificacao
  tipoCard: 'conta' | 'meta' | 'concluida' | 'evento'
  titulo: string
  // Linha curta (ex.: "R$ 1.200,00 · Despesa fixa")
  subtitulo: string
  // Texto do modal
  descricao: string
  // Linha de data do modal (ex.: "Vencimento: 10 de outubro de 2026")
  dataTexto: string
  // "Amanhã", "Em 3 dias", "Há 2 dias"
  quando: string
  atrasada: boolean
  // Menor = mais urgente
  prioridade: number
  // Presente nas notificações de contas
  conta?: ContaDoMes
  // Só as de lembrete/atraso permitem "Marcar como paga/recebida"
  permiteConfirmar?: boolean
  metaId?: string
}

// Quantos meses pra trás procurar contas atrasadas
const MESES_DE_ATRASO = 2
// Quantos dias antes o lembrete de meta/evento aparece
const DIAS_AVISO_META = 14
const DIAS_AVISO_EVENTO = 30
// Quanto tempo uma "alteração de valor" continua aparecendo
const DIAS_AVISO_ALTERACAO = 30

function notificacoesDeContas(
  transacoes: Transacao[],
  baixas: Baixa[],
  hoje: Date,
): Notificacao[] {
  const lista: Notificacao[] = []

  // Do mês de atraso mais antigo até o mês que vem
  let competencia: Competencia = competenciaAtual(hoje)
  for (let i = 0; i < MESES_DE_ATRASO; i++) competencia = competenciaAnterior(competencia)
  const ultima = competenciaSeguinte(competenciaAtual(hoje))

  while (competencia <= ultima) {
    for (const conta of contasFixasDoMes(transacoes, baixas, competencia, hoje)) {
      if (!estaAberta(conta) || conta.diasParaVencer > 7) continue

      const despesa = conta.tipo === 'gasto'
      const atrasada = conta.diasParaVencer < 0
      const prazo = descreverPrazo(conta.diasParaVencer)
      const quando = prazo.toLowerCase()

      let titulo: string
      let descricao: string

      if (despesa) {
        titulo = atrasada
          ? `Pagamento de ${conta.nome} em atraso`
          : conta.diasParaVencer === 0
            ? `${conta.nome} vence hoje`
            : conta.diasParaVencer === 1
              ? `${conta.nome} vence amanhã`
              : `${conta.nome} vence em ${conta.diasParaVencer} dias`

        descricao = atrasada
          ? `O vencimento foi em ${dataPorExtenso(conta.dataVencimento)} e o pagamento ainda não foi confirmado no app. Se você já pagou, marque como paga.`
          : `Sua despesa está programada para vencer ${conta.diasParaVencer === 0 ? 'hoje' : quando}. Confira se já foi paga para evitar juros e multas.`
      } else {
        titulo = atrasada
          ? `Recebimento de ${conta.nome} ainda não confirmado`
          : conta.diasParaVencer === 0
            ? `Recebimento de ${conta.nome} previsto para hoje`
            : conta.diasParaVencer === 1
              ? `Recebimento de ${conta.nome} previsto para amanhã`
              : `Recebimento de ${conta.nome} previsto em ${conta.diasParaVencer} dias`

        descricao = atrasada
          ? `O recebimento estava previsto para ${dataPorExtenso(conta.dataVencimento)} e ainda não foi confirmado no app. Se o valor já caiu na sua conta, marque como recebida.`
          : `O recebimento está previsto para ${dataPorExtenso(conta.dataVencimento)}. Quando o valor cair na sua conta, confirme no app.`
      }

      lista.push({
        id: `conta:${conta.transacaoId}:${conta.competencia}:${atrasada ? 'atraso' : 'lembrete'}`,
        categoria: 'contas',
        tipoCard: 'conta',
        titulo,
        subtitulo: `${formatarMoeda(conta.valorPrevisto)} · ${despesa ? 'Despesa fixa' : 'Receita fixa'}`,
        descricao,
        dataTexto: `${despesa ? 'Vencimento' : 'Recebimento'}: ${dataPorExtenso(conta.dataVencimento)}`,
        quando: atrasada ? `Atrasada ${prazo.toLowerCase()}` : prazo,
        atrasada,
        prioridade: conta.diasParaVencer,
        conta,
        permiteConfirmar: true,
      })
    }

    competencia = competenciaSeguinte(competencia)
  }

  return lista
}

// Aviso de que o valor de uma conta fixa foi alterado (vale dali pra frente)
function notificacoesDeAlteracao(
  transacoes: Transacao[],
  baixas: Baixa[],
  hoje: Date,
): Notificacao[] {
  const lista: Notificacao[] = []

  for (const transacao of transacoes) {
    for (const vigencia of transacao.vigencias ?? []) {
      const idade = (hoje.getTime() - new Date(vigencia.alteradaEm).getTime()) / 86400000
      if (idade > DIAS_AVISO_ALTERACAO) continue

      const anterior = versaoNoMes(transacao, competenciaAnterior(vigencia.desde)).valor
      const novo = vigencia.dados.valor
      if (anterior === novo) continue

      const conta = contaDoMes(transacao, baixas, vigencia.desde, hoje)
      if (!conta) continue

      lista.push({
        id: `alteracao:${transacao.id}:${vigencia.desde}`,
        categoria: 'contas',
        tipoCard: 'conta',
        titulo: `Valor de ${vigencia.dados.nome} alterado`,
        subtitulo: `${formatarMoeda(anterior)} → ${formatarMoeda(novo)}`,
        descricao: `O valor previsto mudou de ${formatarMoeda(anterior)} para ${formatarMoeda(novo)} a partir de ${mesPorExtenso(vigencia.desde)}. Os meses anteriores não foram alterados.`,
        dataTexto: `Vale a partir de ${mesPorExtenso(vigencia.desde)}`,
        quando: idade < 1 ? 'Hoje' : `Há ${Math.floor(idade)} dias`,
        atrasada: false,
        prioridade: 20,
        conta,
      })
    }
  }

  return lista
}

function notificacoesDeMetas(metas: Meta[], hoje: Date): Notificacao[] {
  const lista: Notificacao[] = []

  for (const meta of metas) {
    const percentual = percentualMeta(meta)
    const faltam = Math.max(0, meta.valorTotal - meta.valorAtual)

    if (meta.status === 'concluida' && meta.dataFinal) {
      const [ano, mes, dia] = meta.dataFinal.split('-').map(Number)
      const dias = Math.round((hoje.getTime() - new Date(ano, mes - 1, dia).getTime()) / 86400000)
      if (dias > 7) continue

      lista.push({
        id: `meta-concluida:${meta.id}`,
        categoria: 'metas',
        tipoCard: 'concluida',
        titulo: `Parabéns! A meta "${meta.nome}" foi concluída`,
        subtitulo: formatarMoeda(meta.valorTotal),
        descricao: `Você guardou os ${formatarMoeda(meta.valorTotal)} da meta "${meta.nome}".`,
        dataTexto: `Concluída em ${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`,
        quando: dias <= 0 ? 'Hoje' : `Há ${dias} dias`,
        atrasada: false,
        prioridade: 45,
        metaId: meta.id,
      })
      continue
    }

    if (meta.status !== 'andamento') continue

    // Prazo chegando ou vencido
    if (meta.dataLimite && /^\d{2}\/\d{2}\/\d{4}$/.test(meta.dataLimite)) {
      const dias = diasAte(meta.dataLimite, hoje)

      if (dias <= DIAS_AVISO_META) {
        const vencida = dias < 0
        lista.push({
          id: `meta-prazo:${meta.id}:${vencida ? 'vencida' : 'proxima'}`,
          categoria: 'metas',
          tipoCard: 'meta',
          titulo: vencida ? `O prazo da meta "${meta.nome}" passou` : `Meta "${meta.nome}" perto do prazo`,
          subtitulo: `${percentual}% guardado`,
          descricao: `Faltam ${formatarMoeda(faltam)} para concluir a meta "${meta.nome}". O prazo ${vencida ? 'terminou' : 'termina'} em ${dataPorExtenso(meta.dataLimite)}.`,
          dataTexto: `Prazo: ${dataPorExtenso(meta.dataLimite)}`,
          quando: vencida ? `Atrasada ${descreverPrazo(dias).toLowerCase()}` : descreverPrazo(dias),
          atrasada: vencida,
          prioridade: dias,
          metaId: meta.id,
        })
        continue
      }
    }

    // Quase lá
    if (percentual >= 80 && percentual < 100) {
      lista.push({
        id: `meta-quase:${meta.id}`,
        categoria: 'metas',
        tipoCard: 'meta',
        titulo: `Você está a apenas ${formatarMoeda(faltam)} da meta "${meta.nome}"`,
        subtitulo: `${percentual}% guardado`,
        descricao: `Faltam ${formatarMoeda(faltam)} de ${formatarMoeda(meta.valorTotal)} para concluir a meta "${meta.nome}".`,
        dataTexto: `Progresso: ${percentual}%`,
        quando: 'Em andamento',
        atrasada: false,
        prioridade: 40,
        metaId: meta.id,
      })
    }
  }

  return lista
}

// TODO: os eventos ainda vêm dos eventos de exemplo (os mesmos do card
// "Eventos" da Home). Quando o calendário real estiver ligado, trocar aqui.
function notificacoesDeEventos(hoje: Date): Notificacao[] {
  const lista: Notificacao[] = []

  for (const evento of EVENTOS_MES_MOCK) {
    const [ano, mes, dia] = evento.data.split('-').map(Number)
    const dataTexto = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`
    const dias = diasAte(dataTexto, hoje)

    if (dias < 0 || dias > DIAS_AVISO_EVENTO) continue

    lista.push({
      id: `evento:${evento.id}`,
      categoria: 'eventos',
      tipoCard: 'evento',
      titulo: dias === 0 ? `${evento.nome} é hoje` : dias === 1 ? `${evento.nome} é amanhã` : `${evento.nome} em ${dias} dias`,
      subtitulo: `${diaMes(dataTexto)} · ${evento.hora}`,
      descricao: evento.descricao || `Evento marcado para ${dataPorExtenso(dataTexto)}.`,
      dataTexto: `${dataPorExtenso(dataTexto)} às ${evento.hora}`,
      quando: descreverPrazo(dias),
      atrasada: false,
      prioridade: dias,
    })
  }

  return lista
}

// Todas as notificações, das mais urgentes (atrasos) pras menos
export function gerarNotificacoes(
  transacoes: Transacao[],
  baixas: Baixa[],
  metas: Meta[],
  hoje = new Date(),
): Notificacao[] {
  return [
    ...notificacoesDeContas(transacoes, baixas, hoje),
    ...notificacoesDeAlteracao(transacoes, baixas, hoje),
    ...notificacoesDeMetas(metas, hoje),
    ...notificacoesDeEventos(hoje),
  ].sort((a, b) => a.prioridade - b.prioridade)
}