import { api } from "../../../services/api";

export type TipoItemCalendario =
  | "RECEITA"
  | "DESPESA"
  | "META"
  | "DIVIDA"
  | "EVENTO";

export type ItemCalendario = {
  id: number;
  titulo: string;
  data: string;
  tipo: TipoItemCalendario;

  valor?: number;
  descricao?: string;

  horarioInicio?: string;
  horarioFim?: string;
  diaInteiro?: boolean;
};

export async function listarItensCalendario(
  inicio: string,
  fim: string
): Promise<ItemCalendario[]> {
  const response = await api.get<ItemCalendario[]>(
    "/calendario",
    {
      params: {
        inicio,
        fim,
      },
    }
  );

  return response.data;
}