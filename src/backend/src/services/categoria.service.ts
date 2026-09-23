import { prisma } from "../lib/prisma.js";

export async function criarCategoria(dados: {
  id_Usuario: number;
  nome: string;
  tipo: string;
}) {
  const categoria = await prisma.categoria.create({
    data: dados,
  });

  return categoria;
}