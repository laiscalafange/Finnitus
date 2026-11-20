import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";
import { api, errorMessage } from "@/services/api";
import { formatarMoeda } from "@/features/menuMais/utils";
import {
  cancelarLembretesFinanceiros,
  sincronizarLembretesEventos,
} from "@/features/calendar/services/notificacoesEventos";

export type TamanhoTexto = "PEQUENO" | "MEDIO" | "GRANDE";
export type AlertaId = "vencimento" | "gastos" | "calendario" | "planoB" | "resumo" | "metas";

type Configuracoes = Record<AlertaId, boolean> & {
  idioma: "pt-BR";
  moeda: "BRL";
  mostrarValores: boolean;
  tamanhoTexto: TamanhoTexto;
};

type ValorContexto = {
  configuracoes: Configuracoes | null;
  carregando: boolean;
  salvando: boolean;
  erro: string;
  revisaoFinanceira: number;
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
      configuracoes, carregando, salvando, erro, revisaoFinanceira, carregar, atualizar, recomecar,
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

export function useMoedaVisivel() {
  const exibir = useExibirValores();
  return useCallback((valor: number) => exibir(formatarMoeda(valor)), [exibir]);
}
