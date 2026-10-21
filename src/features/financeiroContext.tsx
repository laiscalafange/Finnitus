import { createContext, useCallback, useContext, useMemo, useEffect, useState, type ReactNode } from 'react'

import { useAuth } from "./authContext"; 

import {
  criarMetaApi,
  listarMetasApi,
  listarHistoricoApi,
  adicionarAporteApi,
  retirarMetaApi,
  cancelarMetaApi,
  type MetaApi,
} from "../services/metasApi";
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

// Tipo de renda informado na configuração inicial
export type TipoRenda = 'fixa' | 'variavel' | 'nenhuma'

export type FinanceiroState = {
  // Se a pessoa tem renda fixa, variável ou não tem renda
  tipoRenda?: TipoRenda
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
  setTipoRenda: (tipo?: TipoRenda) => void
  setSalario: (valor?: number) => void
  setDespesas: (valor?: number) => void
  setEconomiaFutura: (valor?: number) => void
  setTempoEconomia: (valor?: number) => void
  setMetasSelecionadas: (metas: string[]) => void

  // Metas (todas as telas de Metas leem e alteram essa mesma lista)
  metas: Meta[]
  carregarMetas: () => Promise<void>
  criarMeta: (dados: NovaMeta) => Promise<Meta>
  movimentarMeta: (
    id: string,
    tipo: 'deposito' | 'retirada',
    valor: number,
  ) => Promise<ResultadoMovimento>
  cancelarMeta: (id: string) => Promise<void>
  // No frontend antigo o menu chama "excluirMeta"; no backend isso vira
  // cancelamento para preservar a meta no Histórico.
  excluirMeta: (id: string) => Promise<void>

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

function dataBackendParaTela(
  data?: string | null,
) {
  if (!data) {
    return undefined;
  }

  const somenteData =
    data.slice(0, 10);

  const [ano, mes, dia] =
    somenteData.split("-");

  return `${dia}/${mes}/${ano}`;
}

function dataTelaParaBackend(
  data?: string,
) {
  if (!data) {
    return undefined;
  }

  const [dia, mes, ano] =
    data.split("/");

  return `${ano}-${mes}-${dia}`;
}

function mesAtualBackend() {
  const hoje = new Date();

  const ano =
    hoje.getFullYear();

  const mes = String(
    hoje.getMonth() + 1,
  ).padStart(2, "0");

  return `${ano}-${mes}`;
}

function converterMetaApi(
  meta: MetaApi,
): Meta {
  const dataFinal =
    meta.Mdata_conclusao ??
    meta.Mdata_cancelamento ??
    undefined;

  return {
    id: String(
      meta.id_Meta,
    ),

    nome:
      meta.Mnome,

    tipo:
      meta.Mtipo === "MENSAL"
        ? "mes"
        : "longoPrazo",

    status:
      meta.Mstatus ===
      "CONCLUIDA"
        ? "concluida"
        : meta.Mstatus ===
            "CANCELADA"
          ? "cancelada"
          : "andamento",

    valorAtual:
      Number(
        meta.Mvalor_atual,
      ),

    valorTotal:
      Number(
        meta.Mvalor_objetivo,
      ),

    dataLimite:
      dataBackendParaTela(
        meta.Mprazo,
      ),

    dataFinal:
      dataFinal
        ? dataFinal.slice(0, 10)
        : undefined,

    categoriaId:
      "outros",

    movimentacoes:
      (
        meta.MovimentacaoMeta ??
        []
      ).map(
        (movimentacao) => {
          const instante =
            new Date(
              movimentacao.data,
            );

          return {
            id: String(
              movimentacao.id_Movimentacao,
            ),

            tipo:
              movimentacao.tipo ===
              "APORTE"
                ? "deposito"
                : "retirada",

            valor:
              Number(
                movimentacao.valor,
              ),

            data:
              movimentacao.data.slice(
                0,
                10,
              ),

            horario:
              instante.toLocaleTimeString(
                "pt-BR",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              ),
          };
        },
      ),
  };
}

export function FinanceiroProvider({ children }: { children: ReactNode }) {
  // Usuário que está autenticado no aplicativo
  const { user } = useAuth();

  const [tipoRenda, setTipoRenda] = useState<TipoRenda | undefined>()
  const [salario, setSalario] = useState<number | undefined>()
  const [despesas, setDespesas] = useState<number | undefined>()
  const [economiaFutura, setEconomiaFutura] = useState<number | undefined>()
  const [tempoEconomia, setTempoEconomia] = useState<number | undefined>()
  const [metasSelecionadas, setMetasSelecionadas] = useState<string[]>([])

  // Metas carregadas do banco Neon
  const [metas, setMetas] = useState<Meta[]>([])

  // Transações
  const [transacoes, setTransacoes] = useState<Transacao[]>([])

  // Pagamentos e notificações
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

  // Carrega metas ativas do mês atual + metas concluídas/canceladas do histórico.
  // Assim, ao fechar e abrir o app, os dados voltam do banco.
  const carregarMetas = useCallback(async (): Promise<void> => {
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
  }, [])

  useEffect(() => {
  if (!user?.id) {
    setMetas([]);
    return;
  }

  void carregarMetas().catch((error) => {
    console.error(
      "Erro ao recuperar metas do Neon:",
      error
    );
  });
}, [user?.id, carregarMetas]);

  // Cria a meta no backend e só depois adiciona o registro retornado à UI.
  const criarMeta = useCallback(async (dados: NovaMeta): Promise<Meta> => {
    const resposta = await criarMetaApi({
      nome: dados.nome.trim(),
      tipo: dados.tipo === 'mes' ? 'MENSAL' : 'LONGO_PRAZO',
      valorObjetivo: dados.valorTotal,
      valorInicial: dados.valorInicial,
      dataLimite: dataTelaParaBackend(dados.dataLimite),
      mesReferencia: dados.tipo === 'mes' ? mesAtualBackend() : undefined,
    })

    const meta = converterMetaApi(resposta)

    setMetas((atual) => [
      ...atual.filter((item) => item.id !== meta.id),
      meta,
    ])

    return meta
  }, [])

  // Deposita ou retira usando o backend. Depois recarrega as metas para que
  // valor, status e histórico de movimentações fiquem iguais ao banco.
  const movimentarMeta = useCallback(
    async (
      id: string,
      tipo: 'deposito' | 'retirada',
      valor: number,
    ): Promise<ResultadoMovimento> => {
      const meta = metas.find((item) => item.id === id)

      if (!meta || meta.status !== 'andamento') {
        return 'naoEncontrada'
      }

      if (tipo === 'retirada' && valor > meta.valorAtual) {
        return 'saldoInsuficiente'
      }

      const idNumero = Number(id)

      if (!Number.isInteger(idNumero) || idNumero <= 0) {
        return 'naoEncontrada'
      }

      const resposta =
        tipo === 'deposito'
          ? await adicionarAporteApi(idNumero, valor)
          : await retirarMetaApi(idNumero, valor)

      await carregarMetas()

      return resposta?.meta?.Mstatus === 'CONCLUIDA' ? 'concluida' : 'ok'
    },
    [metas, carregarMetas],
  )

  // Cancela no backend. A meta continua salva e passa a aparecer no Histórico.
  const cancelarMeta = useCallback(
    async (id: string): Promise<void> => {
      const idNumero = Number(id)

      if (!Number.isInteger(idNumero) || idNumero <= 0) {
        return
      }

      await cancelarMetaApi(idNumero)
      await carregarMetas()
    },
    [carregarMetas],
  )

  // Mantido por compatibilidade com a tela atual. Em vez de apagar do banco,
  // cancela a meta para que ela permaneça no Histórico.
  const excluirMeta = cancelarMeta

  const value = useMemo(
    () => ({
      tipoRenda,
      salario,
      despesas,
      economiaFutura,
      tempoEconomia,
      metasSelecionadas,
      setTipoRenda,
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
      tipoRenda,
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