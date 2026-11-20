import { api } from "./api";
import type { AxiosInstance } from "axios";

export type TipoNotificacao =
  | "RECEITA_CRIADA"
  | "DESPESA_CRIADA"
  | "RECEITA_RECEBIDA"
  | "DESPESA_PAGA"
  | "META_CRIADA"
  | "META_APORTE"
  | "META_RETIRADA"
  | "META_CONCLUIDA"
  | "EVENTO_CONFIRMADO"
  | "EVENTO_CRIADO"
  | "CONTA_VENCIMENTO"
  | "PLANO_B"
  | "RESUMO_MENSAL";

export type Notificacao = {
  id_Notificacao: number;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  relacionadoTipo: "RECEITA" | "DESPESA" | "META" | "EVENTO" | null;
  relacionadoId: number | null;
  lida: boolean;
  criadaEm: string;
  lidaEm: string | null;
};

export interface ListagemNotificacoes {
  notificacoes: Notificacao[];
  totalNaoLidas: number;
  total: number;
  pagina: number;
  limite: number;
}

/** Injete a instância `api` já autenticada do frontend Expo (com JWT). */
export function criarClienteNotificacoes(api: AxiosInstance) {
  return {
    async listar(opcoes: { limite?: number; pagina?: number; apenasNaoLidas?: boolean } = {}) {
      const { data } = await api.get<ListagemNotificacoes>("/notificacoes", { params: opcoes });
      return data;
    },
    async marcarLida(id: number) {
      const { data } = await api.patch<{ notificacao: Notificacao }>(`/notificacoes/${id}/ler`);
      return data.notificacao;
    },
    async marcarNaoLida(id: number) {
      const { data } = await api.patch<{ notificacao: Notificacao }>(`/notificacoes/${id}/nao-lida`);
      return data.notificacao;
    },
    async marcarTodasLidas() {
      const { data } = await api.patch<{ atualizadas: number }>("/notificacoes/ler-todas");
      return data.atualizadas;
    },
  };
}

export const notificacoesApi = criarClienteNotificacoes(api);
