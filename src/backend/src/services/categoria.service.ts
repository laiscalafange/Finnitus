
import { prisma } from "../lib/prisma.js";

export async function listarCategorias() {
  return prisma.categoria.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}

export async function criarCategoria(dados: {
  nome: string;
  tipo: "RECEITA" | "DESPESA";
}) {
  const categoria = await prisma.categoria.create({
    data: {
      nome: dados.nome,
      tipo: dados.tipo,
    },
  });

  return categoria;
}
