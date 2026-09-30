import { prisma } from "../lib/prisma.js";

export async function criarEvento(dados: {
  id_Usuario: number;
  Enome: string;
  Edescricao: string;
  valor_relacionado: number;
  Edata: string;
  tipo: "RECEBIMENTO" | "PAGAMENTO" | "META" | "OUTRO";   
  
}) {
  const eventos = await prisma.evento.create({
    data: {
      id_Usuario: dados.id_Usuario,
      Enome: dados.Enome,
      Edescricao: dados.Edescricao,
      valor_relacionado: dados.valor_relacionado,
      Edata: new Date(dados.Edata),
      tipo: dados.tipo,
    },
  });

  return eventos;
}