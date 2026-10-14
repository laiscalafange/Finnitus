import { prisma } from "../lib/prisma.js";

export async function criarMeta(dados: {
  id_Usuario: number;
  Mnome: string;
  Mvalor_objetivo: number;
  Mvalor_atual: number;
  Mvalor_periodo?: number;
  Mprazo: string;
  Mprioridade: "BAIXA" | "MEDIA" | "ALTA";
  Mstatus: "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";        
}) {
  const meta = await prisma.meta.create({
    data: {
      id_Usuario: dados.id_Usuario,
      Mnome: dados.Mnome,
      Mvalor_objetivo: dados.Mvalor_objetivo,
      Mvalor_atual: dados.Mvalor_atual,
      Mvalor_periodo: dados.Mvalor_periodo,
      Mprazo: new Date(dados.Mprazo),
      Mprioridade: dados.Mprioridade,
      Mstatus: dados.Mstatus,
    },
  });

  return meta;
}