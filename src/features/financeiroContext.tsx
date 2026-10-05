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
}

// Dados do formulário do Novo gasto (o id é criado ao salvar)
export type NovaTransacao = Omit<Transacao, 'id'>

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

  // Guarda a transação do Novo gasto (a mais recente fica no começo da lista)
  const adicionarTransacao = useCallback((dados: NovaTransacao): Transacao => {
    const transacao: Transacao = { id: novoId(), ...dados }

    setTransacoes((atual) => [transacao, ...atual])

    return transacao
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