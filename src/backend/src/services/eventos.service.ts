import { assertOwnedLinks } from "./ownership.service.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

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
  await assertOwnedLinks(dados.id_Usuario, dados.id_Receita, dados.id_Despesa);
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

export async function listarEventos(
  id_Usuario: number,
  inicio?: string,
  fim?: string,
) {
  const eventos = await prisma.evento.findMany({
    where: {
      id_Usuario,

      ...(inicio && fim
        ? {
            data_inicio: {
              gte: new Date(inicio),
              lt: new Date(fim),
            },
          }
        : {}),
    },

    orderBy: {
      data_inicio: "asc",
    },
  });

  return eventos;
}
export async function buscarEvento(idEvento: number, idUsuario: number) {
  return prisma.evento.findFirst({ where: { id_Evento: idEvento, id_Usuario: idUsuario } });
}

export async function atualizarEvento(idEvento: number, idUsuario: number, dados: Record<string, unknown>) {
  const allowed = ["Enome", "Edescricao", "data_inicio", "data_fim", "dia_inteiro", "tipo"];
  const campos = Object.keys(dados);
  if (!campos.length || campos.some(key => !allowed.includes(key))) {
    throw new HttpError(400, "Informe apenas os campos editáveis do evento.");
  }
  const data: Record<string, unknown> = {};
  for (const chave of campos) data[chave] = dados[chave];
  if (typeof data.Enome === "string") {
    const nome = data.Enome.trim();
    if (!nome || nome.length > 100) throw new HttpError(400, "Nome do evento inválido.");
    data.Enome = nome;
  }
  for (const key of ["data_inicio", "data_fim"]) {
    if (data[key] != null) {
      if (typeof data[key] !== "string" || Number.isNaN(Date.parse(data[key] as string))) {
        throw new HttpError(400, "Data inválida.");
      }
      data[key] = new Date(data[key] as string);
    }
  }
  if (data.dia_inteiro !== undefined && typeof data.dia_inteiro !== "boolean") throw new HttpError(400, "Dia inteiro inválido.");
  if (data.tipo !== undefined && !["RECEBIMENTO", "PAGAMENTO", "META", "OUTRO"].includes(data.tipo as string)) throw new HttpError(400, "Tipo de evento inválido.");
  const result = await prisma.evento.updateMany({ where: { id_Evento: idEvento, id_Usuario: idUsuario }, data });
  return result.count ? buscarEvento(idEvento, idUsuario) : null;
}

export async function excluirEvento(idEvento: number, idUsuario: number) {
  const result = await prisma.evento.deleteMany({ where: { id_Evento: idEvento, id_Usuario: idUsuario } });
  return result.count > 0;
}
