import { prisma } from "../lib/prisma.js";

export async function criarDivida(dados: {
  id_Usuario: number;
  id_Categoria: number;
  id_CategoriaPersonalizada: number;
  nome : string;
  valor_total: number;
  valor_parcela: number;
  quantidade_parcelas: number;
  parcelas_restantes: number;
  data_vencimento: string;
  taxa_juros: number;
  status: "ATIVA" | "QUITADA" | "ATRASADA";
}) {
  const divida = await prisma.divida.create({
    data: {
      id_Usuario: dados.id_Usuario,
      nome: dados.nome,
      valor_total: dados.valor_total,
      valor_parcela: dados.valor_parcela,
      quantidade_parcelas: dados.quantidade_parcelas,
      parcelas_restantes: dados.parcelas_restantes,
      data_vencimento: new Date(dados.data_vencimento),
      taxa_juros: dados.taxa_juros,
      status: dados.status,
    },
  });

  return divida;
}