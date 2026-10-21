
import { api } from "../../../services/api";

export type ConfirmarEventoFinanceiroPayload = {
  idEventoExterno: string;
  tituloEvento: string;
  dataInicio: string;
  dataFim?: string;
  diaInteiro?: boolean;
  tipoMovimentacao: "RECEITA" | "DESPESA";
  descricao: string;
  valor: number;
  data: string;
};

export type MarcarEventoNaoFinanceiroPayload = {
  idEventoExterno: string;
  tituloEvento: string;
  dataInicio: string;
  dataFim?: string;
  diaInteiro?: boolean;
};

export async function marcarEventoNaoFinanceiro(
  dados: MarcarEventoNaoFinanceiroPayload
) {
  const response = await api.post(
    "/calendario/nao-financeiro",
    dados
  );

  return response.data;
}

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

  origem?: "FINNITUS" | "DISPOSITIVO";
  idEventoExterno?: string;
  statusFinanceiro?: string;
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

  if (!Array.isArray(response.data)) {
    console.error(
      "Resposta inesperada do calendário:",
      response.data
    );

    throw new Error(
      "O backend não retornou uma lista de eventos."
    );
  }

  const itens = response.data;

  const porTipo = itens.reduce<Record<string, number>>(
    (resultado, item) => {
      resultado[item.tipo] =
        (resultado[item.tipo] ?? 0) + 1;

      return resultado;
    },
    {}
  );

  console.log("CALENDÁRIO API:", {
    inicio,
    fim,
    total: itens.length,
    porTipo,
  });

  return itens;
}
