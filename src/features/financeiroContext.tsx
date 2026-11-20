
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { useAuth } from "./authContext"

import {
  criarMetaApi,
  listarMetasApi,
  listarHistoricoApi,
  adicionarAporteApi,
  retirarMetaApi,
  cancelarMetaApi,
  reabrirMetaApi,
  atualizarMetaApi,
  type MetaApi,
} from "../services/metasApi"

import {
  type Meta,
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

import { perfilFinanceiroService } from "../services/perfilFinanceiro"


export type FinanceiroState = {
  rendaFixa?: number
  rendaVariavel?: number
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
  dataLimite?: string
}

// Uma transação registrada em "Novo gasto"
export type Transacao = {
  id: string
  tipo: TipoTransacao
  valor: number
  categoriaId: string
  data: string
  descricao?: string
  repetirMensalmente: boolean
  observacao?: string
  tipoRecebimento?: TipoRecebimento
  ate?: string
  vigencias?: VigenciaConta[]
}

// Dados do formulário do Novo gasto
export type NovaTransacao = Omit<Transacao, 'id'>

// Dados que a pessoa pode alterar numa conta
export type EdicaoConta = {
  nome: string
  valor: number
  dia?: number
  data?: string
  observacao?: string
  tipoRecebimento?: TipoRecebimento
}

// Pagamento/recebimento confirmado
export type NovaBaixa = {
  transacaoId: string
  competencia: string
  dataRealizada: string
  valorRealizado: number
}

// Resultado de um depósito ou retirada numa meta
export type ResultadoMovimento =
  | 'ok'
  | 'concluida'
  | 'saldoInsuficiente'
  | 'naoEncontrada'

type FinanceiroContextValue = FinanceiroState & {
  setRendaFixa: (valor?: number) => void
  setRendaVariavel: (valor?: number) => void
  setSalario: (valor?: number) => void
  setDespesas: (valor?: number) => void
  setEconomiaFutura: (valor?: number) => void
  setTempoEconomia: (valor?: number) => void
  setMetasSelecionadas: (metas: string[]) => void

  metas: Meta[]
  carregarMetas: () => Promise<void>
  criarMeta: (dados: NovaMeta) => Promise<Meta>
  movimentarMeta: (
    id: string,
    tipo: 'deposito' | 'retirada',
    valor: number,
  ) => Promise<ResultadoMovimento>
  cancelarMeta: (id: string) => Promise<void>
  reabrirMeta: (id: string) => Promise<void>
  editarMeta: (
    id: string,
    dados: { nome: string; tipo: Meta['tipo']; valorTotal: number },
  ) => Promise<'ok' | 'concluida'>
  excluirMeta: (id: string) => Promise<void>

  transacoes: Transacao[]
  adicionarTransacao: (dados: NovaTransacao) => Transacao

  baixas: Baixa[]
  registrarBaixa: (dados: NovaBaixa) => 'ok' | 'jaRegistrada' | 'naoEncontrada'
  editarTransacao: (
    id: string,
    dados: EdicaoConta,
    competencia: string,
  ) => { aPartirDe: string } | undefined
  excluirTransacao: (id: string, competencia: string) => void

  notificacoesLidas: string[]
  marcarNotificacoesLidas: (ids: string[]) => void
}

const FinanceiroContext =
  createContext<FinanceiroContextValue | undefined>(undefined)

function novoId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function dataBackendParaTela(data?: string | null) {
  if (!data) {
    return undefined
  }

  const somenteData = data.slice(0, 10)
  const [ano, mes, dia] = somenteData.split("-")

  return `${dia}/${mes}/${ano}`
}

function dataTelaParaBackend(data?: string) {
  if (!data) {
    return undefined
  }

  const [dia, mes, ano] = data.split("/")

  return `${ano}-${mes}-${dia}`
}

function mesAtualBackend() {
  const hoje = new Date()
  const ano = hoje.getFullYear()

  const mes = String(
    hoje.getMonth() + 1,
  ).padStart(2, "0")

  return `${ano}-${mes}`
}

function converterMetaApi(meta: MetaApi): Meta {
  const dataFinal =
    meta.Mdata_conclusao ??
    meta.Mdata_cancelamento ??
    undefined

  return {
    id: String(meta.id_Meta),

    nome: meta.Mnome,

    tipo:
      meta.Mtipo === "MENSAL"
        ? "mes"
        : "longoPrazo",

    status:
      meta.Mstatus === "CONCLUIDA"
        ? "concluida"
        : meta.Mstatus === "CANCELADA"
          ? "cancelada"
          : "andamento",

    valorAtual: Number(meta.Mvalor_atual),

    valorTotal: Number(meta.Mvalor_objetivo),

    configurada: true,

    dataLimite: dataBackendParaTela(meta.Mprazo),

    dataFinal: dataFinal
      ? dataFinal.slice(0, 10)
      : undefined,

    categoriaId: "outros",

    movimentacoes: (
      meta.MovimentacaoMeta ?? []
    ).map((movimentacao) => {
      const instante = new Date(movimentacao.data)

      return {
        id: String(movimentacao.id_Movimentacao),

        tipo:
          movimentacao.tipo === "APORTE"
            ? "deposito"
            : "retirada",

        valor: Number(movimentacao.valor),

        data: movimentacao.data.slice(0, 10),

        horario: instante.toLocaleTimeString(
          "pt-BR",
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
      }
    }),
  }
}

export function FinanceiroProvider({
  children,
}: {
  children: ReactNode
}) {
  // Usuário autenticado
  const { user } = useAuth()

  // Dados financeiros
  const [rendaFixa, setRendaFixa] = useState<number | undefined>()
  const [rendaVariavel, setRendaVariavel] = useState<number | undefined>()
  const [salario, setSalario] = useState<number | undefined>()
  const [despesas, setDespesas] = useState<number | undefined>()
  const [economiaFutura, setEconomiaFutura] = useState<number | undefined>()
  const [tempoEconomia, setTempoEconomia] = useState<number | undefined>()
  const [metasSelecionadas, setMetasSelecionadas] = useState<string[]>([])

  // Metas
  const [metas, setMetas] = useState<Meta[]>([])

  // Transações
  const [transacoes, setTransacoes] = useState<Transacao[]>([])

  // Pagamentos e notificações
  const [baixas, setBaixas] = useState<Baixa[]>([])
  const [notificacoesLidas, setNotificacoesLidas] = useState<string[]>([])

  // Recupera os dados financeiros salvos no banco
  const carregarPerfilFinanceiro = useCallback(async (): Promise<void> => {
    try {
      console.log("Buscando perfil financeiro...")

      const perfil = await perfilFinanceiroService.buscar()

      console.log("Perfil recebido da API:", perfil)

      if (!perfil) {
        console.log("Nenhum perfil financeiro encontrado.")

        setRendaFixa(undefined)
        setRendaVariavel(undefined)
        setSalario(undefined)
        setDespesas(undefined)

        return
      }

      const fixa =
        perfil.renda_fixa == null
          ? undefined
          : Number(perfil.renda_fixa)

      const variavel =
        perfil.renda_variavel == null
          ? undefined
          : Number(perfil.renda_variavel)

      const total = (fixa ?? 0) + (variavel ?? 0)

      setRendaFixa(fixa)
      setRendaVariavel(variavel)
      setSalario(total > 0 ? total : undefined)
      setDespesas(Number(perfil.despesas_mensais ?? 0))

      console.log("Dados financeiros atualizados:", {
        fixa,
        variavel,
        salario: total,
        despesas: perfil.despesas_mensais,
      })
    } catch (error) {
      console.error("Erro ao buscar perfil financeiro:", error)
      throw error
    }
  }, [])

  // Guarda a transação do Novo gasto
  const adicionarTransacao = useCallback(
    (dados: NovaTransacao): Transacao => {
      const transacao: Transacao = {
        id: novoId(),
        ...dados,
      }

      setTransacoes((atual) => [
        transacao,
        ...atual,
      ])

      return transacao
    },
    [],
  )

  // Marca uma conta fixa como paga/recebida
  const registrarBaixa = useCallback(
    (
      dados: NovaBaixa,
    ): 'ok' | 'jaRegistrada' | 'naoEncontrada' => {
      const transacao = transacoes.find(
        (item) => item.id === dados.transacaoId,
      )

      if (!transacao || !transacao.repetirMensalmente) {
        return 'naoEncontrada'
      }

      if (
        baixas.some(
          (item) =>
            item.transacaoId === dados.transacaoId &&
            item.competencia === dados.competencia,
        )
      ) {
        return 'jaRegistrada'
      }

      const baixa: Baixa = {
        id: novoId(),
        transacaoId: dados.transacaoId,
        competencia: dados.competencia,
        dataRealizada: dados.dataRealizada,
        valorPrevisto: versaoNoMes(
          transacao,
          dados.competencia,
        ).valor,
        valorRealizado: dados.valorRealizado,
        registradaEm: new Date().toISOString(),
      }

      setBaixas((atual) => [
        baixa,
        ...atual,
      ])

      return 'ok'
    },
    [transacoes, baixas],
  )

  // Primeiro mês em que uma conta pode ser alterada
  const primeiroMesLivre = useCallback(
    (id: string, competencia: string) =>
      baixas.some(
        (item) =>
          item.transacaoId === id &&
          item.competencia === competencia,
      )
        ? competenciaSeguinte(competencia)
        : competencia,
    [baixas],
  )

  // Edita uma transação
  const editarTransacao = useCallback(
    (
      id: string,
      dados: EdicaoConta,
      competencia: string,
    ) => {
      const transacao = transacoes.find(
        (item) => item.id === id,
      )

      if (!transacao) {
        return undefined
      }

      const observacao =
        dados.observacao?.trim() || undefined

      // Conta avulsa: edita diretamente
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
                  tipoRecebimento:
                    dados.tipoRecebimento ?? item.tipoRecebimento,
                },
          ),
        )

        return {
          aPartirDe: competenciaDaData(
            dados.data ?? transacao.data,
          ),
        }
      }

      // Conta fixa: cria uma nova vigência
      const desde = primeiroMesLivre(id, competencia)

      const diaAtual =
        partesData(transacao.data)?.dia ?? 1

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
                vigencias: [
                  ...(item.vigencias ?? []).filter(
                    (vigenciaAtual) =>
                      vigenciaAtual.desde !== desde,
                  ),
                  vigencia,
                ].sort(
                  (a, b) =>
                    a.desde.localeCompare(b.desde),
                ),
              },
        ),
      )

      return {
        aPartirDe: desde,
      }
    },
    [transacoes, primeiroMesLivre],
  )

  // Exclui uma transação
  const excluirTransacao = useCallback(
    (id: string, competencia: string) => {
      const transacao = transacoes.find(
        (item) => item.id === id,
      )

      if (!transacao) {
        return
      }

      const removerTudo = () => {
        setTransacoes((lista) =>
          lista.filter((item) => item.id !== id),
        )

        setBaixas((lista) =>
          lista.filter((item) => item.transacaoId !== id),
        )
      }

      if (!transacao.repetirMensalmente) {
        removerTudo()
        return
      }

      // Conta fixa: encerra no mês anterior ao informado
      const ultimoMes = competenciaAnterior(
        primeiroMesLivre(id, competencia),
      )

      if (
        ultimoMes < competenciaDaData(transacao.data)
      ) {
        removerTudo()
        return
      }

      setTransacoes((lista) =>
        lista.map((item) =>
          item.id !== id
            ? item
            : {
                ...item,
                ate:
                  item.ate && item.ate < ultimoMes
                    ? item.ate
                    : ultimoMes,
              },
        ),
      )
    },
    [transacoes, primeiroMesLivre],
  )

  // Marca notificações como lidas
  const marcarNotificacoesLidas = useCallback(
    (ids: string[]) => {
      setNotificacoesLidas((atual) =>
        Array.from(new Set([...atual, ...ids])),
      )
    },
    [],
  )

  // Carrega metas do banco
  const carregarMetas = useCallback(
    async (): Promise<void> => {
      const mes = mesAtualBackend()

      const [ativas, historico] = await Promise.all([
        listarMetasApi(mes),
        listarHistoricoApi(),
      ])

      const todas = [
        ...ativas.mensais,
        ...ativas.longoPrazo,
        ...historico,
      ].map(converterMetaApi)

      setMetas(todas)
    },
    [],
  )

  // Carrega as informações quando o usuário estiver autenticado
  useEffect(() => {
    if (!user?.id) {
      setMetas([])
      return
    }

    void carregarMetas().catch((error) => {
      console.error(
        "Erro ao recuperar metas do Neon:",
        error,
      )
    })
  }, [user?.id, carregarMetas])

  // Recupera o perfil financeiro do usuário autenticado
  useEffect(() => {
    if (!user?.id) {
      setRendaFixa(undefined)
      setRendaVariavel(undefined)
      setSalario(undefined)
      setDespesas(undefined)
      return
    }

    void carregarPerfilFinanceiro().catch((error) => {
      console.error(
        "Erro ao recuperar perfil financeiro:",
        error,
      )
    })
  }, [user?.id, carregarPerfilFinanceiro])

  // Cria uma meta no backend
  const criarMeta = useCallback(
    async (dados: NovaMeta): Promise<Meta> => {
      const resposta = await criarMetaApi({
        nome: dados.nome.trim(),
        tipo:
          dados.tipo === 'mes'
            ? 'MENSAL'
            : 'LONGO_PRAZO',
        valorObjetivo: dados.valorTotal,
        valorInicial: dados.valorInicial,
        dataLimite: dataTelaParaBackend(
          dados.dataLimite,
        ),
        mesReferencia:
          dados.tipo === 'mes'
            ? mesAtualBackend()
            : undefined,
      })

      const meta = converterMetaApi(resposta)

      setMetas((atual) => [
        ...atual.filter((item) => item.id !== meta.id),
        meta,
      ])

      return meta
    },
    [],
  )

  // Deposita ou retira de uma meta
  const movimentarMeta = useCallback(
    async (
      id: string,
      tipo: 'deposito' | 'retirada',
      valor: number,
    ): Promise<ResultadoMovimento> => {
      const meta = metas.find(
        (item) => item.id === id,
      )

      if (!meta || meta.status !== 'andamento') {
        return 'naoEncontrada'
      }

      if (
        tipo === 'retirada' &&
        valor > meta.valorAtual
      ) {
        return 'saldoInsuficiente'
      }

      const idNumero = Number(id)

      if (
        !Number.isInteger(idNumero) ||
        idNumero <= 0
      ) {
        return 'naoEncontrada'
      }

      const resposta =
        tipo === 'deposito'
          ? await adicionarAporteApi(idNumero, valor)
          : await retirarMetaApi(idNumero, valor)

      await carregarMetas()

      return resposta?.meta?.Mstatus === 'CONCLUIDA'
        ? 'concluida'
        : 'ok'
    },
    [metas, carregarMetas],
  )

  // Cancela uma meta
  const cancelarMeta = useCallback(
    async (id: string): Promise<void> => {
      const idNumero = Number(id)

      if (
        !Number.isInteger(idNumero) ||
        idNumero <= 0
      ) {
        return
      }

      await cancelarMetaApi(idNumero)
      await carregarMetas()
    },
    [carregarMetas],
  )

  // Edita uma meta
  const editarMeta = useCallback(
    async (
      id: string,
      dados: {
        nome: string
        tipo: Meta['tipo']
        valorTotal: number
      },
    ): Promise<'ok' | 'concluida'> => {
      const idNumero = Number(id)

      if (
        !Number.isInteger(idNumero) ||
        idNumero <= 0
      ) {
        return 'ok'
      }

      const atual = metas.find(
        (item) => item.id === id,
      )

      const resposta = await atualizarMetaApi(
        idNumero,
        {
          nome: dados.nome.trim(),
          tipo:
            dados.tipo === 'mes'
              ? 'MENSAL'
              : 'LONGO_PRAZO',
          valorObjetivo: dados.valorTotal,
          mesReferencia:
            dados.tipo === 'mes' &&
            atual?.tipo !== 'mes'
              ? mesAtualBackend()
              : undefined,
        },
      )

      await carregarMetas()

      return resposta?.Mstatus === 'CONCLUIDA'
        ? 'concluida'
        : 'ok'
    },
    [metas, carregarMetas],
  )

  // Reabre uma meta
  const reabrirMeta = useCallback(
    async (id: string): Promise<void> => {
      const idNumero = Number(id)

      if (
        !Number.isInteger(idNumero) ||
        idNumero <= 0
      ) {
        return
      }

      await reabrirMetaApi(idNumero)
      await carregarMetas()
    },
    [carregarMetas],
  )

  // Mantido por compatibilidade com a tela atual
  const excluirMeta = cancelarMeta

  // Valores disponibilizados pelo contexto
  const value = useMemo(
    () => ({
      rendaFixa,
      rendaVariavel,
      salario,
      despesas,
      economiaFutura,
      tempoEconomia,
      metasSelecionadas,

      setRendaFixa,
      setRendaVariavel,
      setSalario,
      setDespesas,
      setEconomiaFutura,
      setTempoEconomia,
      setMetasSelecionadas,

      metas,
      carregarMetas,
      criarMeta,
      movimentarMeta,
      cancelarMeta,
      reabrirMeta,
      editarMeta,
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
      rendaFixa,
      rendaVariavel,
      salario,
      despesas,
      economiaFutura,
      tempoEconomia,
      metasSelecionadas,
      metas,
      carregarMetas,
      criarMeta,
      movimentarMeta,
      cancelarMeta,
      reabrirMeta,
      editarMeta,
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

  return (
    <FinanceiroContext.Provider value={value}>
      {children}
    </FinanceiroContext.Provider>
  )
}

export function useFinanceiro() {
  const context = useContext(FinanceiroContext)

  if (!context) {
    throw new Error(
      'useFinanceiro deve ser usado dentro de FinanceiroProvider',
    )
  }

  return context
}