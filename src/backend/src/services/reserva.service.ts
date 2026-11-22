import { prisma } from "../lib/prisma.js";

export class ErroReserva extends Error {
  constructor(
    public readonly status: number,
    mensagem: string
  ) {
    super(mensagem);
    this.name = "ErroReserva";
  }
}

// O PostgreSQL guarda os valores como DECIMAL(10,2).
// Validamos centavos e enviamos strings exatas para o Prisma.
function validarValor(valor: unknown): string {
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    throw new ErroReserva(400, "Informe um valor numérico válido.");
  }

  const centavos = Math.round(valor * 100);
  if (
    valor <= 0 ||
    valor > 99999999.99 ||
    Math.abs(valor * 100 - centavos) > 0.00001
  ) {
    throw new ErroReserva(400, "Informe um valor positivo com até duas casas decimais.");
  }

  return (centavos / 100).toFixed(2);
}

async function buscarNoBanco(idUsuario: number) {
  return prisma.reservaFinanceira.findUnique({
    where: { id_Usuario: idUsuario },
    include: {
      movimentacoes: {
        orderBy: [
          { data: "desc" },
          { id_Movimentacao: "desc" },
        ],
        take: 5,
      },
    },
  });
}

type ReservaEncontrada = NonNullable<Awaited<ReturnType<typeof buscarNoBanco>>>;

function prepararResposta(reserva: ReservaEncontrada) {
  const meta = Number(reserva.valor_desejado);

  return {
    saldo: Number(reserva.valor_atual),
    meta: meta > 0 ? meta : undefined,
    movimentacoes: reserva.movimentacoes.map((mov) => ({
      id: String(mov.id_Movimentacao),
      tipo: mov.tipo === "DEPOSITO" ? "deposito" : "retirada",
      valor: Number(mov.valor),
      data: mov.data.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
    })),
  };
}

export async function consultarReserva(idUsuario: number) {
  const reserva = await buscarNoBanco(idUsuario);
  return reserva ? prepararResposta(reserva) : null;
}

export async function criarReserva(idUsuario: number) {
  try {
    await prisma.reservaFinanceira.create({
      data: {
        id_Usuario: idUsuario,
        valor_atual: "0.00",
        valor_desejado: "0.00",
      },
    });
  } catch (erro) {
    if (
      erro !== null &&
      typeof erro === "object" &&
      "code" in erro &&
      erro.code === "P2002"
    ) {
      throw new ErroReserva(409, "Você já possui uma reserva de emergência.");
    }
    throw erro;
  }

  return consultarReserva(idUsuario);
}

export async function definirMetaReserva(idUsuario: number, valor: unknown) {
  const valorDecimal = validarValor(valor);

  const resultado = await prisma.reservaFinanceira.updateMany({
    where: { id_Usuario: idUsuario },
    data: { valor_desejado: valorDecimal },
  });
  if (resultado.count === 0) {
    throw new ErroReserva(404, "Reserva não encontrada.");
  }

  return consultarReserva(idUsuario);
}

export async function depositarReserva(idUsuario: number, valor: unknown) {
  const valorDecimal = validarValor(valor);

  await prisma.$transaction(async (tx) => {
    const reserva = await tx.reservaFinanceira.findUnique({
      where: { id_Usuario: idUsuario },
      select: { id_Reserva: true },
    });
    if (!reserva) {
      throw new ErroReserva(404, "Reserva não encontrada.");
    }

    await tx.reservaFinanceira.update({
      where: { id_Reserva: reserva.id_Reserva, id_Usuario: idUsuario },
      data: { valor_atual: { increment: valorDecimal } },
    });

    await tx.movimentacaoReserva.create({
      data: {
        id_Reserva: reserva.id_Reserva,
        tipo: "DEPOSITO",
        valor: valorDecimal,
      },
    });
  });

  return consultarReserva(idUsuario);
}

export async function retirarReserva(idUsuario: number, valor: unknown) {
  const valorDecimal = validarValor(valor);

  await prisma.$transaction(async (tx) => {
    const reserva = await tx.reservaFinanceira.findUnique({
      where: { id_Usuario: idUsuario },
      select: { id_Reserva: true },
    });
    if (!reserva) {
      throw new ErroReserva(404, "Reserva não encontrada.");
    }

    // WHERE saldo >= valor + decrement são executados numa única operação.
    // Isso impede duas retiradas concorrentes de produzirem saldo negativo.
    const resultado = await tx.reservaFinanceira.updateMany({
      where: {
        id_Reserva: reserva.id_Reserva,
        id_Usuario: idUsuario,
        valor_atual: { gte: valorDecimal },
      },
      data: { valor_atual: { decrement: valorDecimal } },
    });

    if (resultado.count === 0) {
      throw new ErroReserva(409, "Saldo insuficiente para esta retirada.");
    }

    await tx.movimentacaoReserva.create({
      data: {
        id_Reserva: reserva.id_Reserva,
        tipo: "RETIRADA",
        valor: valorDecimal,
      },
    });
  });

  return consultarReserva(idUsuario);
}

export async function excluirReserva(idUsuario: number) {
  const resultado = await prisma.reservaFinanceira.deleteMany({
    where: { id_Usuario: idUsuario },
  });
  if (resultado.count === 0) {
    throw new ErroReserva(404, "Reserva não encontrada.");
  }

  return { mensagem: "Reserva excluída com sucesso." };
}
export async function atualizarMetaReserva(
  idUsuario: number,
  valor: number | null,
  tempoEconomia: number | null
) {
  if (valor !== null && (!Number.isFinite(valor) || valor < 0)) {
    throw new ErroReserva(400, "Informe um valor válido para a reserva.");
  }

  if (
    tempoEconomia !== null &&
    (!Number.isInteger(tempoEconomia) || tempoEconomia < 1)
  ) {
    throw new ErroReserva(400, "Informe um prazo válido.");
  }

  await prisma.reservaFinanceira.upsert({
    where: { id_Usuario: idUsuario },
    create: {
      id_Usuario: idUsuario,
      valor_desejado: valor ?? 0,
      tempo_economia: tempoEconomia,
    },
    update: {
      valor_desejado: valor ?? 0,
      tempo_economia: tempoEconomia,
    },
  });

  return prisma.reservaFinanceira.findUnique({
    where: { id_Usuario: idUsuario },
  });
}
