import { api } from "../../../services/api";
export type ConfirmarEventoFinanceiroPayload = {
  idEventoExterno: string;
  tituloEvento: string;
  dataInicio: string;
  dataFim?: string;
  diaInteiro?: boolean;

  tipoMovimentacao:
    | "RECEITA"
    | "DESPESA";

  descricao: string;
  valor: number;
  data: string;
};

export async function confirmarEventoFinanceiro(
  dados: ConfirmarEventoFinanceiroPayload
) {
  const response = await api.post(
    "/calendario/confirmar-evento",
    dados
  );

  return response.data;
}

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