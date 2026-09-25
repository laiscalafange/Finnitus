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

export async function criarCategoriasPadrao(id_Usuario: number) {
  const categorias = [
    // Despesas
    {
      id_Usuario,
      nome: "Alimentação",
      tipo: "DESPESA",
    },
    {
      id_Usuario,
      nome: "Moradia",
      tipo: "DESPESA",
    },
    {
      id_Usuario,
      nome: "Transporte",
      tipo: "DESPESA",
    },
    {
      id_Usuario,
      nome: "Saúde",
      tipo: "DESPESA",
    },
    {
      id_Usuario,
      nome: "Educação",
      tipo: "DESPESA",
    },
    {
      id_Usuario,
      nome: "Lazer",
      tipo: "DESPESA",
    },
    {
      id_Usuario,
      nome: "Contas",
      tipo: "DESPESA",
    },
    {
      id_Usuario,
      nome: "Compras",
      tipo: "DESPESA",
    },
    {
      id_Usuario,
      nome: "Dívidas",
      tipo: "DESPESA",
    },
    {
      id_Usuario,
      nome: "Outros",
      tipo: "DESPESA",
    },

    // Receitas
    {
      id_Usuario,
      nome: "Salário",
      tipo: "RECEITA",
    },
    {
      id_Usuario,
      nome: "Freelance",
      tipo: "RECEITA",
    },
    {
      id_Usuario,
      nome: "Vendas",
      tipo: "RECEITA",
    },
    {
      id_Usuario,
      nome: "Benefícios",
      tipo: "RECEITA",
    },
    {
      id_Usuario,
      nome: "Investimentos",
      tipo: "RECEITA",
    },
    {
      id_Usuario,
      nome: "Outros",
      tipo: "RECEITA",
    },
  ];

  await prisma.categoria.createMany({
    data: categorias,
  });
}