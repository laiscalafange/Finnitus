import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { errorMessage } from "../../services/api";
import { notificacoesApi, type Notificacao } from "../../services/notificacoes.api";

const SEM_AVISOS: { notificacoes: Notificacao[]; totalNaoLidas: number } = {
  notificacoes: [],
  totalNaoLidas: 0,
};

/** Os dados e a leitura vêm sempre da conta autenticada no servidor. */
export function useNotificacoes() {
  const [avisos, setAvisos] = useState(SEM_AVISOS);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setAtualizando(true);
    try {
      const resposta = await notificacoesApi.listar({ limite: 100, pagina: 1 });
      setAvisos({ notificacoes: resposta.notificacoes, totalNaoLidas: resposta.totalNaoLidas });
      setErro(null);
    } catch (error) {
      setErro(errorMessage(error));
      // Não manter informações de uma conta anterior após falha de autenticação.
      setAvisos(SEM_AVISOS);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void carregar();
  }, [carregar]));

  const marcarLida = useCallback(async (id: number) => {
    try {
      const atualizada = await notificacoesApi.marcarLida(id);
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

  return { ...avisos, carregando, atualizando, erro, carregar, marcarLida, marcarTodasLidas };
}
