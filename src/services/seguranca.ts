import { api } from "./api";
import type { Desafio2FA, Session } from "./auth";

export type SessaoUsuario = {
  id: string;
  dispositivo: string;
  criadaEm: string;
  atual: boolean;
};

export type EstadoDuasEtapas = { ativa: boolean; disponivel: boolean };

export const segurancaService = {
  async listarSessoes() {
    const { data } = await api.get<{ sessoes: SessaoUsuario[] }>("/me/sessoes");
    return data.sessoes;
  },

  async desconectarSessao(id: string) {
    await api.delete(`/me/sessoes/${encodeURIComponent(id)}`);
  },

  async verDuasEtapas() {
    const { data } = await api.get<EstadoDuasEtapas>("/me/2fa");
    return data;
  },

  async solicitarAlteracao(ativar: boolean) {
    const rota = ativar ? "/me/2fa/ativar" : "/me/2fa/desativar";
    const { data } = await api.post<Desafio2FA>(rota, {});
    return data;
  },

  async confirmarAlteracao(ativar: boolean, challengeId: string, codigo: string) {
    const rota = ativar ? "/me/2fa/confirmar" : "/me/2fa/desativar";
    const { data } = await api.post<Session & { ativa: boolean }>(rota, { challengeId, codigo });
    return data;
  },
};
