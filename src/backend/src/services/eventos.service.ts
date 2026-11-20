import { assertOwnedLinks } from "./ownership.service.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";
import { notificarEventoCriado } from "./notificacoes.gatilhos.js";

export type CriarEventoDados = {
  id_Usuario: number;
  Enome: string;
  Edescricao?: string;
  data_inicio: string;
  data_fim?: string;
  dia_inteiro?: boolean;
  tipo?: "RECEBIMENTO" | "PAGAMENTO" | "META" | "OUTRO";
  origem?: "FINNITUS" | "DISPOSITIVO";
  id_evento_externo?: string;
  status_financeiro?: "NAO_ANALISADO" | "SUSPEITO" | "CONFIRMADO" | "NAO_FINANCEIRO";
  valor_relacionado?: number;
  id_Receita?: number;
  id_Despesa?: number;
};

function dataObrigatoria(valor: unknown, nome: string): Date {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(valor)) {
    throw new HttpError(400, `${nome} deve ser uma data ISO com horário.`);
  }
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) throw new HttpError(400, `${nome} inválida.`);
  return data;
}

export async function criarEvento(dados: CriarEventoDados) {
  const nome = typeof dados.Enome === "string" ? dados.Enome.trim() : "";
  if (!nome || nome.length > 100) throw new HttpError(400, "Nome do evento deve ter de 1 a 100 caracteres.");
  if (dados.Edescricao !== undefined && (typeof dados.Edescricao !== "string" || dados.Edescricao.length > 255)) {
    throw new HttpError(400, "Descrição deve ter até 255 caracteres.");
  }
  if (dados.dia_inteiro !== undefined && typeof dados.dia_inteiro !== "boolean") throw new HttpError(400, "Dia inteiro inválido.");
  if (dados.tipo !== undefined && !["RECEBIMENTO", "PAGAMENTO", "META", "OUTRO"].includes(dados.tipo)) {
    throw new HttpError(400, "Tipo de evento inválido.");
  }
  if (dados.origem !== undefined && !["FINNITUS", "DISPOSITIVO"].includes(dados.origem)) {
    throw new HttpError(400, "Origem inválida.");
  }
  const inicio = dataObrigatoria(dados.data_inicio, "Data de início");
  const fim = dados.data_fim === undefined || dados.data_fim === null
    ? null : dataObrigatoria(dados.data_fim, "Data de término");
  if (fim && fim <= inicio) throw new HttpError(400, "O término deve ser depois do início.");
  const valor = dados.valor_relacionado;
  if (valor !== undefined && (!Number.isFinite(valor) || valor < 0 || valor > 99999999.99)) {
    throw new HttpError(400, "Valor relacionado inválido.");
  }
  await assertOwnedLinks(dados.id_Usuario, dados.id_Receita, dados.id_Despesa);

  return prisma.$transaction(async (tx) => {
    const evento = await tx.evento.create({
      data: {
        id_Usuario: dados.id_Usuario,
        Enome: nome,
        Edescricao: dados.Edescricao?.trim() || null,
        data_inicio: inicio,
        data_fim: fim,
        dia_inteiro: dados.dia_inteiro ?? false,
        tipo: dados.tipo ?? "OUTRO",
        origem: dados.origem ?? "FINNITUS",
        id_evento_externo: dados.id_evento_externo ?? null,
        status_financeiro: dados.status_financeiro ?? "NAO_ANALISADO",
        valor_relacionado: valor ?? null,
        id_Receita: dados.id_Receita ?? null,
        id_Despesa: dados.id_Despesa ?? null,
      },
    });
    await notificarEventoCriado(tx, evento);
    return evento;
  });
}

export async function listarEventos(id_Usuario: number, inicio?: string, fim?: string) {
  return prisma.evento.findMany({
    where: {
      id_Usuario,
      ...(inicio && fim ? { data_inicio: { gte: new Date(inicio), lt: new Date(fim) } } : {}),
    },
    orderBy: { data_inicio: "asc" },
  });
}

export async function buscarEvento(idEvento: number, idUsuario: number) {
  return prisma.evento.findFirst({ where: { id_Evento: idEvento, id_Usuario: idUsuario } });
}

export async function atualizarEvento(idEvento: number, idUsuario: number, dados: Record<string, unknown>) {
  const allowed = ["Enome", "Edescricao", "data_inicio", "data_fim", "dia_inteiro", "tipo"];
  const campos = Object.keys(dados);
  if (!campos.length || campos.some(key => !allowed.includes(key))) throw new HttpError(400, "Informe apenas os campos editáveis do evento.");
  const data: Record<string, unknown> = {};
  for (const chave of campos) data[chave] = dados[chave];
  if (data.Enome !== undefined) {
    if (typeof data.Enome !== "string" || !data.Enome.trim() || data.Enome.length > 100) throw new HttpError(400, "Nome do evento inválido.");
    data.Enome = data.Enome.trim();
  }
  for (const key of ["data_inicio", "data_fim"]) {
    if (data[key] != null) data[key] = dataObrigatoria(data[key], key);
  }
  if (data.dia_inteiro !== undefined && typeof data.dia_inteiro !== "boolean") throw new HttpError(400, "Dia inteiro inválido.");
  if (data.tipo !== undefined && !["RECEBIMENTO", "PAGAMENTO", "META", "OUTRO"].includes(data.tipo as string)) throw new HttpError(400, "Tipo inválido.");
  const result = await prisma.evento.updateMany({ where: { id_Evento: idEvento, id_Usuario: idUsuario }, data });
  return result.count ? buscarEvento(idEvento, idUsuario) : null;
}

export async function excluirEvento(idEvento: number, idUsuario: number) {
  const result = await prisma.evento.deleteMany({ where: { id_Evento: idEvento, id_Usuario: idUsuario } });
  return result.count > 0;
}
