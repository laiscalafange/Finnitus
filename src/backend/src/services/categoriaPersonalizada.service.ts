import { prisma } from "../lib/prisma.js";

export async function criarCategoriaPersonalizada(dados: {
  id_Usuario: number;
  nome: string;
  tipo: "RECEITA" | "DESPESA";
}) {
  const categoriaPersonalizada = await prisma.categoriaPersonalizada.create({
    data: {
      id_Usuario: dados.id_Usuario,
      nome: dados.nome,
      tipo: dados.tipo,
    },
  });

  return categoriaPersonalizada;
}