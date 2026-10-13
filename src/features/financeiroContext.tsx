import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import {
  METAS_INICIAIS,
  agoraHorario,
  hojeIso,
  type Meta,
  type MovimentacaoMeta,
  type TipoMeta,
} from './metasData'
import type { TipoTransacao } from './menuMais/types'
import {
  competenciaAnterior,
  competenciaDaData,
  competenciaSeguinte,
  partesData,
  versaoNoMes,
  type Baixa,
  type TipoRecebimento,
  type VigenciaConta,
} from './contas/contasData'

export type FinanceiroState = {
  salario?: number
  despesas?: number
  economiaFutura?: number
  tempoEconomia?: number
  metasSelecionadas: string[]
}

// Dados da tela Metas > Criação
export type NovaMeta = {
  nome: string
  tipo: TipoMeta
  valorTotal: number
  valorInicial: number
  // DD/MM/AAAA (opcional)
  dataLimite?: string
}

// Uma transação registrada em "Novo gasto" (saída ou entrada)
export type Transacao = {
  id: string
  tipo: TipoTransacao
  valor: number
  // Mesmo id das categorias do Novo gasto (src/features/menuMais/constants.ts)
  categoriaId: string
  // DD/MM/AAAA
  data: string
  descricao?: string
  repetirMensalmente: boolean
  // Observação opcional (editada na tela de detalhes da conta)
  observacao?: string
  // Só receitas: integral, parcial ou adiantamento
  tipoRecebimento?: TipoRecebimento
  // Conta fixa: último mês (AAAA-MM) em que ela ainda vale. Sem isso, vale
  // todo mês. É preenchido quando a pessoa exclui a conta fixa.
  ate?: string
  // Conta fixa: edições feitas ao longo do tempo (cada uma vale a partir de
  // um mês e não muda os meses anteriores)
  vigencias?: VigenciaConta[]
}

// Dados do formulário do Novo gasto (o id é criado ao salvar)
export type NovaTransacao = Omit<Transacao, 'id'>

// Dados que a pessoa pode alterar numa conta (tela "Editar")
export type EdicaoConta = {
  nome: string
  valor: number
  // Conta fixa: dia do mês (1 a 31)
  dia?: number
  // Conta avulsa: data completa DD/MM/AAAA
  data?: string
  observacao?: string
  tipoRecebimento?: TipoRecebimento
}

// Pagamento/recebimento que a pessoa confirmou
export type NovaBaixa = {
  transacaoId: string
  competencia: string
  // DD/MM/AAAA
  dataRealizada: string
  valorRealizado: number
}

// Resultado de um depósito ou retirada numa meta
export type ResultadoMovimento = 'ok' | 'concluida' | 'saldoInsuficiente' | 'naoEncontrada'

type FinanceiroContextValue = FinanceiroState & {
  setSalario: (valor?: number) => void
  setDespesas: (valor?: number) => void
  setEconomiaFutura: (valor?: number) => void
  setTempoEconomia: (valor?: number) => void
  setMetasSelecionadas: (metas: string[]) => void

  // Metas (todas as telas de Metas leem e alteram essa mesma lista)
  metas: Meta[]
  criarMeta: (dados: NovaMeta) => Meta
  movimentarMeta: (id: string, tipo: 'deposito' | 'retirada', valor: number) => ResultadoMovimento
  cancelarMeta: (id: string) => void
  excluirMeta: (id: string) => void

  // Transações do Novo gasto (alimentam as Rotas do Plano-B)
  transacoes: Transacao[]
  adicionarTransacao: (dados: NovaTransacao) => Transacao

  // Contas fixas: pagamentos/recebimentos confirmados (o histórico financeiro)
  baixas: Baixa[]
  registrarBaixa: (dados: NovaBaixa) => 'ok' | 'jaRegistrada' | 'naoEncontrada'
  // Edita a conta. Conta fixa: vale a partir do mês informado (ou do mês
  // seguinte, se aquele mês já foi pago/recebido) e não muda meses anteriores.
  // Devolve o mês (AAAA-MM) a partir do qual a edição passou a valer.
  editarTransacao: (id: string, dados: EdicaoConta, competencia: string) => { aPartirDe: string } | undefined
  // Exclui a conta. Conta fixa: encerra a partir do mês informado e mantém o histórico.
  excluirTransacao: (id: string, competencia: string) => void

  // Notificações já lidas (os ids vêm de features/contas/notificacoesData)
  notificacoesLidas: string[]
  marcarNotificacoesLidas: (ids: string[]) => void
}

const FinanceiroContext = createContext<FinanceiroContextValue | undefined>(undefined)

function novoId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function novaMovimentacao(tipo: 'deposito' | 'retirada', valor: number): MovimentacaoMeta {
  return { id: novoId(), tipo, valor, data: hojeIso(), horario: agoraHorario() }
}

export function FinanceiroProvider({ children }: { children: ReactNode }) {
  const [salario, setSalario] = useState<number | undefined>()
  const [despesas, setDespesas] = useState<number | undefined>()
  const [economiaFutura, setEconomiaFutura] = useState<number | undefined>()
  const [tempoEconomia, setTempoEconomia] = useState<number | undefined>()
  const [metasSelecionadas, setMetasSelecionadas] = useState<string[]>([])

  // TODO (backend): ainda não existem endpoints de metas. Por enquanto o
  // estado fica só em memória; quando existirem, carregar a lista da API e
  // chamar a API em cada uma das ações abaixo.
  const [metas, setMetas] = useState<Meta[]>(METAS_INICIAIS)

  // TODO (backend): ainda não existe endpoint de transações. Por enquanto a
  // lista fica só em memória (some ao fechar o app); quando existir, carregar
  // da API aqui e enviar cada nova transação na ação abaixo.
  const [transacoes, setTransacoes] = useState<Transacao[]>([])

  // TODO (backend): idem, os pagamentos/recebimentos confirmados e as
  // notificações lidas ainda ficam só em memória.
  const [baixas, setBaixas] = useState<Baixa[]>([])
  const [notificacoesLidas, setNotificacoesLidas] = useState<string[]>([])

  // Guarda a transação do Novo gasto (a mais recente fica no começo da lista)
  const adicionarTransacao = useCallback((dados: NovaTransacao): Transacao => {
    const transacao: Transacao = { id: novoId(), ...dados }

    setTransacoes((atual) => [transacao, ...atual])

    return transacao
  }, [])

  // Marca uma conta fixa como paga/recebida em um mês. Nunca é chamado
  // sozinho: só depois da pessoa revisar data e valor e confirmar.
  const registrarBaixa = useCallback(
    (dados: NovaBaixa): 'ok' | 'jaRegistrada' | 'naoEncontrada' => {
      const transacao = transacoes.find((item) => item.id === dados.transacaoId)

      if (!transacao || !transacao.repetirMensalmente) {
        return 'naoEncontrada'
      }

      if (
        baixas.some(
          (item) =>
            item.transacaoId === dados.transacaoId && item.competencia === dados.competencia,
        )
      ) {
        return 'jaRegistrada'
      }

      const baixa: Baixa = {
        id: novoId(),
        transacaoId: dados.transacaoId,
        competencia: dados.competencia,
        dataRealizada: dados.dataRealizada,
        // O valor previsto da época fica guardado, separado do valor realizado
        valorPrevisto: versaoNoMes(transacao, dados.competencia).valor,
        valorRealizado: dados.valorRealizado,
        registradaEm: new Date().toISOString(),
      }

      setBaixas((atual) => [baixa, ...atual])

      return 'ok'
    },
    [transacoes, baixas],
  )

  // Se o mês já tem pagamento/recebimento confirmado, a alteração (ou a
  // exclusão) passa a valer só no mês seguinte, pra não mexer no que já foi
  // registrado.
  const primeiroMesLivre = useCallback(
    (id: string, competencia: string) =>
      baixas.some((item) => item.transacaoId === id && item.competencia === competencia)
        ? competenciaSeguinte(competencia)
        : competencia,
    [baixas],
  )

  const editarTransacao = useCallback(
    (id: string, dados: EdicaoConta, competencia: string) => {
      const transacao = transacoes.find((item) => item.id === id)

      if (!transacao) {
        return undefined
      }

      const observacao = dados.observacao?.trim() || undefined

      // Conta avulsa: é um registro só, edita direto
      if (!transacao.repetirMensalmente) {
        setTransacoes((lista) =>
          lista.map((item) =>
            item.id !== id
              ? item
              : {
                  ...item,
                  descricao: dados.nome.trim() || undefined,
                  valor: dados.valor,
                  data: dados.data ?? item.data,
                  observacao,
                  tipoRecebimento: dados.tipoRecebimento ?? item.tipoRecebimento,
                },
          ),
        )

        return { aPartirDe: competenciaDaData(dados.data ?? transacao.data) }
      }

      // Conta fixa: cria uma nova "vigência" a partir do mês. Os meses
      // anteriores continuam com os dados antigos.
      const desde = primeiroMesLivre(id, competencia)
      const diaAtual = partesData(transacao.data)?.dia ?? 1

      const vigencia: VigenciaConta = {
        desde,
        alteradaEm: new Date().toISOString(),
        dados: {
          nome: dados.nome.trim(),
          valor: dados.valor,
          dia: dados.dia ?? diaAtual,
          observacao,
          tipoRecebimento: dados.tipoRecebimento,
        },
      }

      setTransacoes((lista) =>
        lista.map((item) =>
          item.id !== id
            ? item
            : {
                ...item,
                // Edições programadas pra depois desse mês são substituídas
                vigencias: [...(item.vigencias ?? []).filter((v) => v.desde < desde), vigencia],
              },
        ),
      )

      return { aPartirDe: desde }
    },
    [transacoes, primeiroMesLivre],
  )

  const excluirTransacao = useCallback(
    (id: string, competencia: string) => {
      const transacao = transacoes.find((item) => item.id === id)

      if (!transacao) {
        return
      }

      const removerTudo = () => {
        setTransacoes((lista) => lista.filter((item) => item.id !== id))
        setBaixas((lista) => lista.filter((item) => item.transacaoId !== id))
      }

      if (!transacao.repetirMensalmente) {
        removerTudo()
        return
      }

      // Conta fixa: encerra no mês anterior ao informado. O histórico (meses
      // e pagamentos anteriores) fica.
      const ultimoMes = competenciaAnterior(primeiroMesLivre(id, competencia))

      if (ultimoMes < competenciaDaData(transacao.data)) {
        removerTudo()
        return
      }

      setTransacoes((lista) =>
        lista.map((item) =>
          item.id !== id
            ? item
            : { ...item, ate: item.ate && item.ate < ultimoMes ? item.ate : ultimoMes },
        ),
      )
    },
    [transacoes, primeiroMesLivre],
  )

  const marcarNotificacoesLidas = useCallback((ids: string[]) => {
    setNotificacoesLidas((atual) => Array.from(new Set([...atual, ...ids])))
  }, [])

  // Cria a meta com exatamente os dados digitados. O valor inicial já
  // guardado entra como o primeiro depósito do histórico.
  const criarMeta = useCallback((dados: NovaMeta): Meta => {
    const meta: Meta = {
      id: novoId(),
      nome: dados.nome.trim(),
      tipo: dados.tipo,
      status: 'andamento',
      valorAtual: dados.valorInicial,
      valorTotal: dados.valorTotal,
      dataLimite: dados.dataLimite || undefined,
      categoriaId: 'outros',
      movimentacoes:
        dados.valorInicial > 0 ? [novaMovimentacao('deposito', dados.valorInicial)] : [],
    }

    setMetas((atual) => [...atual, meta])

    return meta
  }, [])

  // Deposita ou retira dinheiro de uma meta. Quando o depósito completa o
  // valor objetivo, a meta passa pra "concluída" (vai pro Histórico).
  const movimentarMeta = useCallback(
    (id: string, tipo: 'deposito' | 'retirada', valor: number): ResultadoMovimento => {
      const meta = metas.find((item) => item.id === id)

      if (!meta || meta.status !== 'andamento') {
        return 'naoEncontrada'
      }

      // Soma em centavos pra não errar por arredondamento
      const atual = Math.round(meta.valorAtual * 100)
      const movido = Math.round(valor * 100)

      if (tipo === 'retirada' && movido > atual) {
        return 'saldoInsuficiente'
      }

      const novoValor = (tipo === 'deposito' ? atual + movido : atual - movido) / 100
      const concluiu = tipo === 'deposito' && novoValor >= meta.valorTotal

      setMetas((lista) =>
        lista.map((item) =>
          item.id !== id
            ? item
            : {
                ...item,
                valorAtual: novoValor,
                status: concluiu ? 'concluida' : item.status,
                dataFinal: concluiu ? hojeIso() : item.dataFinal,
                movimentacoes: [novaMovimentacao(tipo, valor), ...item.movimentacoes],
              },
        ),
      )

      return concluiu ? 'concluida' : 'ok'
    },
    [metas],
  )

  // Cancela a meta: ela sai das listas e vai pro Histórico como "cancelada"
  const cancelarMeta = useCallback((id: string) => {
    setMetas((lista) =>
      lista.map((item) =>
        item.id === id ? { ...item, status: 'cancelada', dataFinal: hojeIso() } : item,
      ),
    )
  }, [])

  // Exclui a meta de vez (não aparece nem no Histórico)
  const excluirMeta = useCallback((id: string) => {
    setMetas((lista) => lista.filter((item) => item.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      salario,
      despesas,
      economiaFutura,
      tempoEconomia,
      metasSelecionadas,
      setSalario,
      setDespesas,
      setEconomiaFutura,
      setTempoEconomia,
      setMetasSelecionadas,
      metas,
      criarMeta,
      movimentarMeta,
      cancelarMeta,
      excluirMeta,
      transacoes,
      adicionarTransacao,
      baixas,
      registrarBaixa,
      editarTransacao,
      excluirTransacao,
      notificacoesLidas,
      marcarNotificacoesLidas,
    }),
    [
      salario,
      despesas,
      economiaFutura,
      tempoEconomia,
      metasSelecionadas,
      metas,
      criarMeta,
      movimentarMeta,
      cancelarMeta,
      excluirMeta,
      transacoes,
      adicionarTransacao,
      baixas,
      registrarBaixa,
      editarTransacao,
      excluirTransacao,
      notificacoesLidas,
      marcarNotificacoesLidas,
    ],
  )

  return <FinanceiroContext.Provider value={value}>{children}</FinanceiroContext.Provider>
}

export function useFinanceiro() {
  const context = useContext(FinanceiroContext)
  if (!context) {
    throw new Error('useFinanceiro deve ser usado dentro de FinanceiroProvider')
  }
  return context
}