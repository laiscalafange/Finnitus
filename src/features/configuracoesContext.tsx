import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";
import { api, errorMessage } from "@/services/api";
import type { Idioma } from "@/features/idioma";
import {
  cancelarLembretesFinanceiros,
  sincronizarLembretesEventos,
} from "@/features/calendar/services/notificacoesEventos";

export type TamanhoTexto = "PEQUENO" | "MEDIO" | "GRANDE";
export type AlertaId = "vencimento" | "gastos" | "calendario" | "planoB" | "resumo" | "metas";
export type Moeda = "BRL" | "USD" | "EUR";

type Cotacao = { data: string; taxas: { USD: number; EUR: number } };

type Configuracoes = Record<AlertaId, boolean> & {
  idioma: Idioma;
  moeda: Moeda;
  mostrarValores: boolean;
  tamanhoTexto: TamanhoTexto;
};

type ValorContexto = {
  configuracoes: Configuracoes | null;
  carregando: boolean;
  salvando: boolean;
  erro: string;
  revisaoFinanceira: number;
  cotacao: Cotacao | false | null;
  carregar: () => Promise<void>;
  atualizar: (dados: Partial<Configuracoes>) => Promise<void>;
  recomecar: (confirmacao: string) => Promise<void>;
};

const noop = async () => {};
const Contexto = createContext<ValorContexto>({
  configuracoes: null,
  carregando: false,
  salvando: false,
  erro: "",
  revisaoFinanceira: 0,
  cotacao: null,
  carregar: noop,
  atualizar: noop,
  recomecar: noop,
});

export function ConfiguracoesProvider({ usuarioId, children }: {
  usuarioId?: number;
  children: ReactNode;
}) {
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(null);
  const [carregando, setCarregando] = useState(Boolean(usuarioId));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [revisaoFinanceira, setRevisaoFinanceira] = useState(0);
  const [cotacao, setCotacao] = useState<Cotacao | false | null>(null);
  const leitura = useRef<AbortController | null>(null);
  const meioDeSalvamento = useRef(false);
  const pedidoReset = useRef(false);

  const carregar = useCallback(async () => {
    if (!usuarioId || meioDeSalvamento.current) return;
    leitura.current?.abort();
    const pedido = new AbortController();
    leitura.current = pedido;
    setCarregando(true);
    setErro("");
    try {
      const { data } = await api.get<Configuracoes>("/me/configuracoes", {
        signal: pedido.signal,
      });
      if (!pedido.signal.aborted) setConfiguracoes(data);
    } catch (error) {
      if (!pedido.signal.aborted) setErro(errorMessage(error));
    } finally {
      if (!pedido.signal.aborted) setCarregando(false);
      if (leitura.current === pedido) leitura.current = null;
    }
  }, [usuarioId]);

  useEffect(() => {
    void carregar();
    const listener = AppState.addEventListener("change", (estado) => {
      if (estado === "active") void carregar();
    });
    return () => {
      leitura.current?.abort();
      listener.remove();
    };
  }, [carregar]);

  const calendario = configuracoes?.calendario;
  useEffect(() => {
    void sincronizarLembretesEventos(usuarioId, calendario).catch(() => {
      console.warn("Não foi possível atualizar os lembretes deste aparelho.");
    });
  }, [usuarioId, calendario]);

  const precisaCotacao = configuracoes?.moeda === "USD" || configuracoes?.moeda === "EUR";
  useEffect(() => {
    if (!usuarioId || !precisaCotacao) {
      setCotacao(null);
      return;
    }

    const pedido = new AbortController();
    let consultando = false;
    async function consultar() {
      if (consultando) return;
      consultando = true;
      try {
        const { data } = await api.get<Cotacao>("/me/cotacoes", { signal: pedido.signal });
        const valida = /^\d{4}-\d{2}-\d{2}$/.test(data?.data) &&
          Number.isFinite(data?.taxas?.USD) && data.taxas.USD > 0 &&
          Number.isFinite(data?.taxas?.EUR) && data.taxas.EUR > 0;
        if (!pedido.signal.aborted) setCotacao(valida ? data : false);
      } catch {
        if (!pedido.signal.aborted) setCotacao(false);
      } finally {
        consultando = false;
      }
    }

    void consultar();
    const listener = AppState.addEventListener("change", (estado) => {
      if (estado === "active") void consultar();
    });
    const intervalo = setInterval(() => {
      if (AppState.currentState === "active") void consultar();
    }, 15 * 60 * 1000);
    return () => {
      pedido.abort();
      listener.remove();
      clearInterval(intervalo);
    };
  }, [usuarioId, precisaCotacao]);

  async function atualizar(dados: Partial<Configuracoes>) {
    if (!configuracoes || meioDeSalvamento.current) return;
    meioDeSalvamento.current = true;
    leitura.current?.abort();
    setCarregando(false);
    setSalvando(true);
    setErro("");
    try {
      const { data } = await api.patch<Configuracoes>("/me/configuracoes", dados);
      setConfiguracoes(data);
    } catch (error) {
      setErro(errorMessage(error));
    } finally {
      meioDeSalvamento.current = false;
      setSalvando(false);
    }
  }

  async function recomecar(confirmacao: string) {
    if (pedidoReset.current) return;
    pedidoReset.current = true;
    try {
      await api.delete("/me/dados-financeiros", { data: { confirmacao } });
      // A revisão também descarta o estado local das telas montadas em abas.
      setRevisaoFinanceira((atual) => atual + 1);
      if (usuarioId) {
        void cancelarLembretesFinanceiros(usuarioId).catch(() => {
          console.warn("Não foi possível atualizar os lembretes deste aparelho.");
        });
      }
    } finally {
      pedidoReset.current = false;
    }
  }

  return (
    <Contexto.Provider value={{
      configuracoes, carregando, salvando, erro, revisaoFinanceira, cotacao, carregar, atualizar, recomecar,
    }}>
      {children}
    </Contexto.Provider>
  );
}

export function useConfiguracoes() {
  return useContext(Contexto);
}

export function useExibirValores() {
  const { configuracoes } = useConfiguracoes();
  const mostrarValores = configuracoes?.mostrarValores === true;
  return useCallback(
    (valor: string | number) => mostrarValores ? String(valor) : "•••••",
    [mostrarValores],
  );
}

export function useMoedaVisivel(compacta = false) {
  const exibir = useExibirValores();
  const { configuracoes } = useConfiguracoes();
  const { efetiva, taxa } = useMoedaExibicao();
  const idioma = configuracoes?.idioma === "en" || configuracoes?.idioma === "es"
    ? configuracoes.idioma : "pt-BR";
  const formatador = useMemo(() => new Intl.NumberFormat(idioma, {
    style: "currency", currency: efetiva,
    ...(compacta && { notation: "compact", maximumFractionDigits: 1 }),
  }), [idioma, efetiva, compacta]);

  return useCallback((valor: number) => {
    const convertido = valor * taxa;
    return Number.isFinite(convertido) ? exibir(formatador.format(convertido)) : "—";
  }, [exibir, formatador, taxa]);
}

type MoedaExibicao = {
  escolhida: Moeda;
  efetiva: Moeda;
  estado: "base" | "carregando" | "pronta" | "indisponivel";
  dataReferencia?: string;
  taxa: number;
};

export function useMoedaExibicao(): MoedaExibicao {
  const { configuracoes, cotacao } = useConfiguracoes();
  const escolhida = configuracoes?.moeda === "USD" || configuracoes?.moeda === "EUR"
    ? configuracoes.moeda : "BRL";
  if (escolhida === "BRL") return { escolhida, efetiva: "BRL", estado: "base", taxa: 1 };
  if (!cotacao) {
    return { escolhida, efetiva: "BRL", estado: cotacao === null ? "carregando" : "indisponivel", taxa: 1 };
  }
  return { escolhida, efetiva: escolhida, estado: "pronta", dataReferencia: cotacao.data, taxa: cotacao.taxas[escolhida] };
}
