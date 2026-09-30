import { prisma } from "../lib/prisma.js";

type CriarEventoDados = {
  id_Usuario: number;
  Enome: string;
  Edescricao?: string;
  data_inicio: string;
  data_fim?: string;
  dia_inteiro?: boolean;

  tipo?: "RECEBIMENTO" | "PAGAMENTO" | "META" | "OUTRO";
  origem?: "FINNITUS" | "DISPOSITIVO";

  id_evento_externo?: string;

  status_financeiro?:
    | "NAO_ANALISADO"
    | "SUSPEITO"
    | "CONFIRMADO"
    | "NAO_FINANCEIRO";

  valor_relacionado?: number;

  id_Receita?: number;
  id_Despesa?: number;
};

export async function criarEvento(dados: CriarEventoDados) {
  const evento = await prisma.evento.create({
    data: {
      id_Usuario: dados.id_Usuario,
      Enome: dados.Enome,
      Edescricao: dados.Edescricao,

      data_inicio: new Date(dados.data_inicio),
      data_fim: dados.data_fim
        ? new Date(dados.data_fim)
        : null,

      dia_inteiro: dados.dia_inteiro ?? false,

      tipo: dados.tipo ?? "OUTRO",
      origem: dados.origem ?? "FINNITUS",

      id_evento_externo: dados.id_evento_externo,

      status_financeiro:
        dados.status_financeiro ?? "NAO_ANALISADO",

      valor_relacionado: dados.valor_relacionado,

      id_Receita: dados.id_Receita,
      id_Despesa: dados.id_Despesa,
    },
  });

  return evento;
}