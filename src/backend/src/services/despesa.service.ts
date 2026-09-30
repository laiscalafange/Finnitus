import { prisma } from "../lib/prisma.js";

export async function criarDespesa(dados: {
  id_Usuario: number;
  id_Categoria: number;
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
  const despesa = await prisma.despesa.create({
    data: {
      id_Usuario: dados.id_Usuario,
      id_Categoria: dados.id_Categoria,
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