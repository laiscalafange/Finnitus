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
import { api } from "../services/api";

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
export type StatusReceita = "RECEBIDA" | "PENDENTE";
export type StatusDespesa = "PAGA" | "PENDENTE";

export type TipoCadastro = "FIXA" | "VARIAVEL";

export type FormaPagamento =
  | "DINHEIRO"
  | "PIX"
  | "DEBITO"
  | "CREDITO"
  | "BOLETO";

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
  categoriaNome?: string

  status?: StatusReceita | StatusDespesa
  tipoCadastro?: TipoCadastro
  dataPagamento?: string
  formaPagamento?: FormaPagamento
}

export type NovaTransacao = Omit<Transacao, "id">

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
  adicionarTransacao: (dados: NovaTransacao) => Promise<Transacao>

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

    configurada: meta.Mconfigurada,

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
const CATEGORIAS_PADRAO: Record<string, number> = {
  // Receitas
  salario: 19,
  "renda extra": 20,
  rendimentos: 21,
  presente: 22,
  reembolso: 23,
  outros_receita: 24,
  vendas: 25,
  "aluguel recebido": 26,
  restituição: 27,
  bonus: 28,

  // Despesas
  academia: 14,
  alimentacao: 4,
  contas: 7,
  educacao: 11,
  lazer: 6,
  manutencao: 17,
  mercado: 10,
  moradia: 12,
  outros_despesa: 9,
  pets: 15,
  presentes: 18,
  saude: 8,
  transporte: 5,
  vestuario: 13,
  viagem: 16,
};

function normalizarCategoria(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obterCategoriaBanco(
  categoriaId: string,
  categoriaNome: string,
  tipo: "RECEITA" | "DESPESA"
) {
  if (categoriaId.startsWith("personalizada-")) {
    const id = Number(categoriaId.replace("personalizada-", ""));

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Categoria personalizada inválida.");
    }

    return {
      id_Categoria: null,
      id_CategoriaPersonalizada: id,
    };
  }

  const nome = categoriaNome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  const categorias: Record<string, number> = {
    "salário": 19,
    "renda extra": 20,
    rendimentos: 21,
    presente: 22,
    reembolso: 23,
    outros: tipo === "RECEITA" ? 24 : 9,
    vendas: 25,
    "aluguel recebido": 26,
    restituição: 27,
    bônus: 28,
    academia: 14,
    alimentação: 4,
    contas: 7,
    educação: 11,
    lazer: 6,
    manutenção: 17,
    mercado: 10,
    moradia: 12,
    pets: 15,
    presentes: 18,
    saúde: 8,
    transporte: 5,
    vestuário: 13,
    viagem: 16,
  };

  const id = categorias[nome];

  if (!id) {
    throw new Error(`Categoria "${categoriaNome}" não encontrada.`);
  }

  return {
    id_Categoria: id,
    id_CategoriaPersonalizada: null,
  };
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
      console.log("Buscando dados financeiros...")

      const perfil = await perfilFinanceiroService.buscar()

      console.log("Dados financeiros recebidos da API:", perfil)

      if (!perfil) {
        setRendaFixa(undefined)
        setRendaVariavel(undefined)
        setSalario(undefined)
        setDespesas(undefined)
        setEconomiaFutura(undefined)
        setTempoEconomia(undefined)
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

      setDespesas(
        perfil.despesas_mensais == null
          ? undefined
          : Number(perfil.despesas_mensais)
      )

      setEconomiaFutura(
        perfil.economia_futura == null
          ? undefined
          : Number(perfil.economia_futura)
      )

      setTempoEconomia(
        perfil.tempo_economia == null
          ? undefined
          : Number(perfil.tempo_economia)
      )

      console.log("Dados financeiros atualizados:", {
        rendaFixa: fixa,
        rendaVariavel: variavel,
        salario: total,
        despesas: perfil.despesas_mensais,
        economiaFutura: perfil.economia_futura,
        tempoEconomia: perfil.tempo_economia,
      })
    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error)
      throw error
    }
  }, [])

  // Guarda a transação do Novo gasto
 const adicionarTransacao = useCallback(
  async (dados: NovaTransacao): Promise<Transacao> => {
    const ehReceita = dados.tipo === "entrada";

    const categoria = obterCategoriaBanco(
    dados.categoriaId,
    dados.categoriaNome ?? dados.categoriaId,
    ehReceita ? "RECEITA" : "DESPESA"
    );

    const frequencia = dados.repetirMensalmente
      ? "MENSAL"
      : "UNICA";

    const descricao =
      dados.descricao?.trim() || dados.categoriaId;

    let resposta: any;

    if (ehReceita) {
      resposta = await api.post("/receitas", {
        ...categoria,
        descricao,
        valor: dados.valor,
        data_recebimento: dataTelaParaBackend(dados.data),
        tipo: dados.tipoCadastro,
        status: dados.status,
        frequencia,
        observacao: dados.observacao,
      });
    } else {
      if (!dados.formaPagamento) {
        throw new Error("Informe a forma de pagamento.");
      }

      if (dados.status === "PAGA" && !dados.dataPagamento) {
        throw new Error("Informe a data do pagamento.");
      }

      resposta = await api.post("/despesas", {
        ...categoria,
        descricao,
        valor: dados.valor,
        data_vencimento: dataTelaParaBackend(dados.data),
        data_pagamento:
          dados.status === "PAGA"
            ? dataTelaParaBackend(dados.dataPagamento)
            : null,
        tipo: dados.tipoCadastro,
        frequencia,
        forma_pagamento: dados.formaPagamento,
        status: dados.status,
        observacao: dados.observacao,
      });
    }

    const registro = resposta.data.receita ??
      resposta.data.despesa ??
      resposta.data;

    const transacao: Transacao = {
      ...dados,
      id: String(
        ehReceita
          ? registro.id_Receita
          : registro.id_Despesa
      ),
      valor: Number(registro.valor),
    };

    setTransacoes((atual) => [transacao, ...atual]);

    return transacao;
  },
  []
);

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

  // Recupera os dados financeiros do usuário autenticado
  useEffect(() => {
    if (!user?.id) {
      setRendaFixa(undefined)
      setRendaVariavel(undefined)
      setSalario(undefined)
      setDespesas(undefined)
      setEconomiaFutura(undefined)
      setTempoEconomia(undefined)
      return
    }

    void carregarPerfilFinanceiro().catch((error) => {
      console.error(
        "Erro ao recuperar dados financeiros:",
        error
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