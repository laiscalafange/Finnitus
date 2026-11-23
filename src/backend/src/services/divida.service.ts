import { assertOwnedCategory } from "./ownership.service.js";
import { notificarDividaCriada, notificarDividaQuitada } from "./notificacoes.gatilhos.js";
import { prisma } from "../lib/prisma.js";

export async function criarDivida(dados: {
  id_Usuario: number;
  id_Categoria?: number | null;
  id_CategoriaPersonalizada?: number | null;
  nome: string;
  valor_total: number;
  valor_parcela: number;
  quantidade_parcelas: number;
  parcelas_restantes: number;
  data_vencimento: string;
  taxa_juros?: number | null;
  status?: "ATIVA" | "QUITADA" | "ATRASADA";
}) {
  return prisma.$transaction(async (tx) => {
    await assertOwnedCategory(tx, dados.id_Usuario, dados.id_CategoriaPersonalizada, "DESPESA");
    const divida = await tx.divida.create({
      data: {
        id_Usuario: dados.id_Usuario,
        id_Categoria: dados.id_Categoria ?? null,
        id_CategoriaPersonalizada: dados.id_CategoriaPersonalizada ?? null,
        nome: dados.nome,
        valor_total: dados.valor_total,
        valor_parcela: dados.valor_parcela,
        quantidade_parcelas: dados.quantidade_parcelas,
        parcelas_restantes: dados.parcelas_restantes,
        data_vencimento: new Date(dados.data_vencimento),
        taxa_juros: dados.taxa_juros ?? null,
        status: dados.status ?? "ATIVA",
      },
    });
    await notificarDividaCriada(tx, divida);
    return divida;
  });
}

export async function listarDividas(id_Usuario: number) {
  return prisma.divida.findMany({
    where: { id_Usuario },
    orderBy: { data_vencimento: "asc" },
  });
}

export async function buscarDivida(
  id_Divida: number,
  id_Usuario: number,
) {
  return prisma.divida.findFirst({
    where: { id_Divida, id_Usuario },
  });
}

export async function atualizarDivida(
  id_Divida: number,
  id_Usuario: number,
  dados: {
    id_Categoria?: number | null;
    id_CategoriaPersonalizada?: number | null;
    nome?: string;
    valor_total?: number;
    valor_parcela?: number;
    quantidade_parcelas?: number;
    parcelas_restantes?: number;
    data_vencimento?: string;
    taxa_juros?: number | null;
    status?: "ATIVA" | "QUITADA" | "ATRASADA";
  },
) {
  return prisma.$transaction(async (tx) => {
    await assertOwnedCategory(tx, id_Usuario, dados.id_CategoriaPersonalizada, "DESPESA");
    const [anterior] = await tx.$queryRaw<{ status: "ATIVA" | "QUITADA" | "ATRASADA" }[]>`
      SELECT "status" FROM "Divida"
      WHERE "id_Divida" = ${id_Divida} AND "id_Usuario" = ${id_Usuario}
      FOR UPDATE
    `;
    if (!anterior) return null;

    const divida = await tx.divida.update({
      where: { id_Divida, id_Usuario },
      data: {
        id_Categoria: dados.id_Categoria,
        id_CategoriaPersonalizada: dados.id_CategoriaPersonalizada,
        nome: dados.nome,
        valor_total: dados.valor_total,
        valor_parcela: dados.valor_parcela,
        quantidade_parcelas: dados.quantidade_parcelas,
        parcelas_restantes: dados.parcelas_restantes,
        data_vencimento: dados.data_vencimento
          ? new Date(dados.data_vencimento)
          : undefined,
        taxa_juros: dados.taxa_juros,
        status: dados.status,
      },
    });
    if (anterior.status !== "QUITADA" && divida.status === "QUITADA") {
      await notificarDividaQuitada(tx, divida);
    }
    return divida;
  });
}

export async function excluirDivida(
  id_Divida: number,
  id_Usuario: number,
) {
  const existente = await buscarDivida(id_Divida, id_Usuario);

  if (!existente) return null;

  const removido = await prisma.divida.deleteMany({
    where: { id_Divida, id_Usuario },
  });
  return removido.count === 1 ? existente : null;
}
