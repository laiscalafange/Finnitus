import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AppState } from "react-native";
import { errorMessage } from "../../services/api";
import { notificacoesApi, type Notificacao } from "../../services/notificacoes.api";

const SEM_AVISOS: { notificacoes: Notificacao[]; totalNaoLidas: number } = {
  notificacoes: [],
  totalNaoLidas: 0,
};

type NotificacoesContextValue = typeof SEM_AVISOS & {
  carregando: boolean;
  atualizando: boolean;
  erro: string | null;
  carregar: () => Promise<void>;
  marcarLida: (id: number) => Promise<void>;
  marcarTodasLidas: () => Promise<void>;
};

const NotificacoesContext = createContext<NotificacoesContextValue | null>(null);

/** Compartilha os avisos e o total de não lidas entre os cabeçalhos e a central. */
export function NotificacoesProvider({ usuarioId, children }: { usuarioId?: number; children: ReactNode }) {
  const [avisos, setAvisos] = useState(SEM_AVISOS);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const revisaoLeitura = useRef(0);
  const consulta = useRef<{ revisao: number; promessa: Promise<void> } | null>(null);

  const carregar = useCallback(() => {
    if (usuarioId === undefined) return Promise.resolve();
    const revisao = revisaoLeitura.current;
    if (consulta.current?.revisao === revisao) return consulta.current.promessa;

    setAtualizando(true);
    const promessa = notificacoesApi.listar({ limite: 100, pagina: 1 })
      .then(resposta => {
        if (revisao !== revisaoLeitura.current) return;
        setAvisos({ notificacoes: resposta.notificacoes, totalNaoLidas: resposta.totalNaoLidas });
        setErro(null);
      })
      .catch(error => {
        if (revisao === revisaoLeitura.current) setErro(errorMessage(error));
      })
      .finally(() => {
        if (consulta.current?.revisao !== revisao) return;
        consulta.current = null;
        setCarregando(false);
        setAtualizando(false);
      });
    consulta.current = { revisao, promessa };
    return promessa;
  }, [usuarioId]);

  useEffect(() => {
    if (usuarioId === undefined) return;
    void carregar();
    const listener = AppState.addEventListener("change", estado => {
      if (estado === "active") void carregar();
    });
    return () => listener.remove();
  }, [carregar, usuarioId]);

  const marcarLida = useCallback(async (id: number) => {
    try {
      const atualizada = await notificacoesApi.marcarLida(id);
      // Descarta respostas de consultas iniciadas antes desta leitura.
      revisaoLeitura.current++;
      setAvisos(lista => {
        const eraNaoLida = lista.notificacoes.some(item => item.id_Notificacao === id && !item.lida);
        return {
          notificacoes: lista.notificacoes.map(item => item.id_Notificacao === id ? atualizada : item),
          totalNaoLidas: Math.max(0, lista.totalNaoLidas - Number(eraNaoLida)),
        };
      });
      setErro(null);
    } catch (error) {
      setErro(errorMessage(error));
      throw error;
    }
  }, []);

  const marcarTodasLidas = useCallback(async () => {
    try {
      await notificacoesApi.marcarTodasLidas();
      revisaoLeitura.current++;
      const agora = new Date().toISOString();
      setAvisos(lista => ({
        notificacoes: lista.notificacoes.map(item => ({ ...item, lida: true, lidaEm: item.lidaEm ?? agora })),
        totalNaoLidas: 0,
      }));
      setErro(null);
    } catch (error) {
      setErro(errorMessage(error));
      throw error;
    }
  }, []);

  return (
    <NotificacoesContext.Provider value={{ ...avisos, carregando, atualizando, erro, carregar, marcarLida, marcarTodasLidas }}>
      {children}
    </NotificacoesContext.Provider>
  );
}

export function useNotificacoes() {
  const contexto = useContext(NotificacoesContext);
  if (!contexto) throw new Error("useNotificacoes precisa de NotificacoesProvider.");
  return contexto;
}
