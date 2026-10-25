
import { api } from "../../../services/api";

export type NovoEventoPayload = {
  Enome: string;
  Edescricao?: string;
  data_inicio: string;
  data_fim?: string;
  dia_inteiro: boolean;
  tipo: "RECEBIMENTO" | "PAGAMENTO" | "META" | "OUTRO";
  valor_relacionado?: number;
};

export type EventoCriado = {
  id_Evento: number;
  Enome: string;
  data_inicio: string;
};

export async function cadastrarEvento(
  dados: NovoEventoPayload
): Promise<EventoCriado> {
  const response = await api.post<EventoCriado>(
    "/eventos",
    dados
  );

  console.log(
    "Evento criado no Finnitus:",
    response.data.id_Evento
  );

  return response.data;
}
