import { api } from "./api";
import type { Reserva } from "@/features/menuMais/types";

export const reservaApi = {
  async buscar(): Promise<Reserva | null> {
    const { data } = await api.get<Reserva | null>("/reserva");
    return data;
  },

  async criar(): Promise<Reserva> {
    const { data } = await api.post<Reserva>("/reserva");
    return data;
  },

  async definirMeta(valor: number): Promise<Reserva> {
    const { data } = await api.patch<Reserva>("/reserva/meta", { valor });
    return data;
  },

  async depositar(valor: number): Promise<Reserva> {
    const { data } = await api.post<Reserva>("/reserva/depositos", { valor });
    return data;
  },

  async retirar(valor: number): Promise<Reserva> {
    const { data } = await api.post<Reserva>("/reserva/retiradas", { valor });
    return data;
  },

  async excluir(): Promise<void> {
    await api.delete("/reserva");
  },
};
