
import { api } from "./api";

// Formato dos dados da tela FinancialData.
export type PerfilFinanceiroData = {
  renda_fixa: number | null;
  renda_variavel: number | null;
  despesas_mensais: number;
};

// Formato dos dados da tela FutureSavings.
export type ReservaFinanceiraData = {
  economia_futura: number | null;
  tempo_economia: number | null;
};

export const perfilFinanceiroService = {
  // Envia renda e despesas para o backend.
  salvar: async (dados: PerfilFinanceiroData) => {
    const response = await api.put("/perfil-financeiro", dados);
    return response.data;
  },

  // Envia os dados da reserva de emergência.
  salvarReserva: async (dados: ReservaFinanceiraData) => {
    const response = await api.patch(
      "/perfil-financeiro/reserva",
      dados
    );
    return response.data;
  },

  // Consulta o perfil financeiro salvo.
  buscar: async () => {
    const response = await api.get("/perfil-financeiro");
    return response.data.perfil;
  },
};
