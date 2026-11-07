import { assertOwnedCategory } from "./ownership.service.js";
import { prisma } from "../lib/prisma.js";

export async function criarDespesa(dados: {
  id_Usuario: number;
  id_Categoria: number;
  id_CategoriaPersonalizada?: number;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  tipo: "FIXA" | "VARIAVEL";
  frequencia: "UNICA" | "SEMANAL" | "QUINZENAL" | "MENSAL" | "ANUAL";
  forma_pagamento: "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO" | "BOLETO"
  status: "PAGA" | "PENDENTE";
  observacao?: string;          
  
}) {
  await assertOwnedCategory(dados.id_Usuario, dados.id_CategoriaPersonalizada);
  const despesa = await prisma.despesa.create({
    data: {
      id_Usuario: dados.id_Usuario,
      id_Categoria: dados.id_Categoria,
      id_CategoriaPersonalizada: dados.id_CategoriaPersonalizada,
      descricao: dados.descricao,
      valor: dados.valor,
      data_vencimento: new Date(dados.data_vencimento),
      data_pagamento: dados.data_pagamento ? new Date(dados.data_pagamento) : null,
      tipo: dados.tipo,
      frequencia: dados.frequencia,
      forma_pagamento: dados.forma_pagamento,
      status: dados.status,
      observacao: dados.observacao,
    },
  });

  return despesa;
}


export async function listarDespesas(id_Usuario: number) {
  return prisma.despesa.findMany({
    where: { id_Usuario },
    orderBy: { data_vencimento: "asc" },
  });
}

export async function buscarDespesa(
  id_Despesa: number,
  id_Usuario: number
) {
  return prisma.despesa.findFirst({
    where: {
      id_Despesa,
      id_Usuario,
    },
  });
}

export async function atualizarDespesa(
  id_Despesa: number,
  id_Usuario: number,
  dados: {
    id_Categoria?: number | null;
    id_CategoriaPersonalizada?: number | null;
    descricao?: string;
    valor?: number;
    data_vencimento?: string;
    data_pagamento?: string | null;
    tipo?: "FIXA" | "VARIAVEL";
    frequencia?: "UNICA" | "SEMANAL" | "QUINZENAL" | "MENSAL" | "ANUAL";
    forma_pagamento?: "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO" | "BOLETO";
    status?: "PAGA" | "PENDENTE";
    observacao?: string | null;
  }
) {
  const existente = await buscarDespesa(id_Despesa, id_Usuario);

  if (!existente) {
    return null;
  }

  await assertOwnedCategory(id_Usuario, dados.id_CategoriaPersonalizada);

  const atualizado = await prisma.despesa.updateMany({
    where: { id_Despesa, id_Usuario },
    data: {
      id_Categoria: dados.id_Categoria,
      id_CategoriaPersonalizada: dados.id_CategoriaPersonalizada,
      descricao: dados.descricao,
      valor: dados.valor,
      data_vencimento: dados.data_vencimento
        ? new Date(dados.data_vencimento)
        : undefined,
      data_pagamento:
        dados.data_pagamento === undefined
          ? undefined
          : dados.data_pagamento === null
            ? null
            : new Date(dados.data_pagamento),
      tipo: dados.tipo,
      frequencia: dados.frequencia,
      forma_pagamento: dados.forma_pagamento,
      status: dados.status,
      observacao: dados.observacao,
    },
  });
  if (atualizado.count !== 1) return null;
  return buscarDespesa(id_Despesa, id_Usuario);
}

export async function excluirDespesa(
  id_Despesa: number,
  id_Usuario: number
) {
  const existente = await buscarDespesa(id_Despesa, id_Usuario);

  if (!existente) {
    return null;
  }

  const removido = await prisma.despesa.deleteMany({
    where: { id_Despesa, id_Usuario },
  });
  return removido.count === 1 ? existente : null;
}
