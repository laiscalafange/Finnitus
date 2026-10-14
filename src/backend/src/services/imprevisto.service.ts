import { prisma } from "../lib/prisma.js";

export async function criarImprevisto(dados: {
  id_Usuario: number;
  Inome: string;
  Ivalor: number;
  Idata: string;
  duracao_meses: number;
  solucao_escolhida: string;
  Idescricao: string;
  tipo: "PERDA_RENDA" | "AUMENTO_DESPESA" | "DESPESA_INESPERADA" | "OUTRO";        
    
}) {
  const imprevisto = await prisma.imprevisto.create({
    data: {
      id_Usuario: dados.id_Usuario,
      Inome: dados.Inome,
      Ivalor: dados.Ivalor,
      Idata: new Date(dados.Idata),
      duracao_meses: dados.duracao_meses,
      solucao_escolhida: dados.solucao_escolhida,
      Idescricao: dados.Idescricao,
      tipo: dados.tipo,
    },
  });

  return imprevisto;
}