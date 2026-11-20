import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { errorMessage } from "../../services/api";
import { notificacoesApi, type Notificacao } from "../../services/notificacoes.api";

/** Os dados e a leitura vêm sempre da conta autenticada no servidor. */
export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setAtualizando(true);
    try {
      const resposta = await notificacoesApi.listar({ limite: 100, pagina: 1 });
      setNotificacoes(resposta.notificacoes);
      setErro(null);
    } catch (error) {
      setErro(errorMessage(error));
      // Não manter informações de uma conta anterior após falha de autenticação.
      setNotificacoes([]);
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
      setNotificacoes(lista => lista.map(item => item.id_Notificacao === id ? atualizada : item));
      setErro(null);
    } catch (error) {
      setErro(errorMessage(error));
      throw error;
    }
  }, []);

  const marcarTodasLidas = useCallback(async () => {
    try {
      await notificacoesApi.marcarTodasLidas();
      setNotificacoes(lista => lista.map(item => ({ ...item, lida: true, lidaEm: item.lidaEm ?? new Date().toISOString() })));
      setErro(null);
    } catch (error) {
      setErro(errorMessage(error));
      throw error;
    }
  }, []);

  return { notificacoes, carregando, atualizando, erro, carregar, marcarLida, marcarTodasLidas };
}
