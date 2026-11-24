
import { prisma } from "../lib/prisma.js";

type DadosPerfilFinanceiro = {
  renda_fixa: unknown;
  renda_variavel: unknown;
  despesas_mensais: unknown;
};

type DadosReservaFinanceira = {
  economia_futura: unknown;
  tempo_economia: unknown;
};

// VALIDAÇÕES

function validarValorMonetario(
  valor: unknown,
  campo: string
): number {
  if (
    typeof valor !== "number" ||
    !Number.isFinite(valor) ||
    valor < 0 ||
    valor > 99_999_999.99
  ) {
    throw new Error(`O valor de ${campo} é inválido.`);
  }

  return valor;
}

function validarValorOpcional(
  valor: unknown,
  campo: string
): number | null {
  if (valor === null) {
    return null;
  }

  return validarValorMonetario(valor, campo);
}

function validarPrazoReserva(valor: unknown): number | null {
  if (valor === null) {
    return null;
  }

  if (
    typeof valor !== "number" ||
    !Number.isInteger(valor) ||
    valor < 1 ||
    valor > 2_147_483_647
  ) {
    throw new Error("O prazo da reserva é inválido.");
  }

  return valor;
}

function dataAtualSemHorario() {
  const agora = new Date();

  return new Date(
    Date.UTC(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate()
    )
  );
}

function obterStatusRendaMensal(): "RECEBIDA" | "PENDENTE" {
  const hoje = new Date();

  const primeiroDiaMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    1
  );

  let diasUteis = 0;
  let quintoDiaUtil: Date | null = null;

  const data = new Date(primeiroDiaMes);

  while (quintoDiaUtil === null) {
    const diaSemana = data.getDay();

    // Segunda a sexta
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasUteis++;
    }

    if (diasUteis === 5) {
      quintoDiaUtil = new Date(data);
      quintoDiaUtil.setHours(0, 0, 0, 0);
    } else {
      data.setDate(data.getDate() + 1);
    }
  }

  const hojeSemHorario = new Date(hoje);
  hojeSemHorario.setHours(0, 0, 0, 0);

  return hojeSemHorario >= quintoDiaUtil
    ? "RECEBIDA"
    : "PENDENTE";
}
// SALVAR RENDA FIXA, RENDA VARIÁVEL E DESPESAS

export async function salvarPerfilFinanceiro(
  idUsuario: number,
  dados: DadosPerfilFinanceiro
) {
  const rendaFixa = validarValorOpcional(
    dados.renda_fixa,
    "renda fixa"
  );

  const rendaVariavel = validarValorOpcional(
    dados.renda_variavel,
    "renda variável"
  );

  const despesasMensais = validarValorMonetario(
    dados.despesas_mensais,
    "despesas mensais"
  );

  return prisma.$transaction(async (tx) => {
    // CATEGORIAS DO ONBOARDING

    const categoriaRendaFixa = await tx.categoria.upsert({
      where: {
        nome_tipo: {
          nome: "Renda fixa",
          tipo: "RECEITA",
        },
      },
      create: {
        nome: "Renda fixa",
        tipo: "RECEITA",
      },
      update: {},
    });

    const categoriaRendaVariavel = await tx.categoria.upsert({
      where: {
        nome_tipo: {
          nome: "Renda variável",
          tipo: "RECEITA",
        },
      },
      create: {
        nome: "Renda variável",
        tipo: "RECEITA",
      },
      update: {},
    });

    const categoriaDespesa = await tx.categoria.upsert({
      where: {
        nome_tipo: {
          nome: "Despesas mensais",
          tipo: "DESPESA",
        },
      },
      create: {
        nome: "Despesas mensais",
        tipo: "DESPESA",
      },
      update: {},
    });

    const dataAtual = dataAtualSemHorario();

    const statusRenda = obterStatusRendaMensal();
    // RENDA FIXA

    const rendaFixaExistente = await tx.receita.findFirst({
      where: {
        id_Usuario: idUsuario,
        id_Categoria: categoriaRendaFixa.id_Categoria,
        descricao: "Renda fixa mensal",
      },
    });

    if (rendaFixa !== null && rendaFixa > 0) {
      if (rendaFixaExistente) {
        await tx.receita.update({
          where: {
            id_Receita: rendaFixaExistente.id_Receita,
          },
          data: {
            valor: rendaFixa,
          },
        });
      } else {
        await tx.receita.create({
          data: {
            id_Usuario: idUsuario,
            id_Categoria: categoriaRendaFixa.id_Categoria,
            descricao: "Renda fixa mensal",
            valor: rendaFixa,
            data_recebimento: dataAtual,
            tipo: "FIXA",
            status: statusRenda,
            frequencia: "MENSAL",
          },
        });
      }
    } else if (rendaFixaExistente) {
      await tx.receita.update({
        where: {
          id_Receita: rendaFixaExistente.id_Receita,
        },
        data: {
          valor: 0,
        },
      });
    }

    // RENDA VARIÁVEL

    const rendaVariavelExistente = await tx.receita.findFirst({
      where: {
        id_Usuario: idUsuario,
        id_Categoria: categoriaRendaVariavel.id_Categoria,
        descricao: "Renda variável mensal",
      },
    });

    if (rendaVariavel !== null && rendaVariavel > 0) {
      if (rendaVariavelExistente) {
        await tx.receita.update({
          where: {
            id_Receita: rendaVariavelExistente.id_Receita,
          },
          data: {
            valor: rendaVariavel,
          },
        });
      } else {
        await tx.receita.create({
          data: {
            id_Usuario: idUsuario,
            id_Categoria: categoriaRendaVariavel.id_Categoria,
            descricao: "Renda variável mensal",
            valor: rendaVariavel,
            data_recebimento: dataAtual,
            tipo: "VARIAVEL",
            status: statusRenda,
            frequencia: "MENSAL",
          },
        });
      }
    } else if (rendaVariavelExistente) {
      await tx.receita.update({
        where: {
          id_Receita: rendaVariavelExistente.id_Receita,
        },
        data: {
          valor: 0,
        },
      });
    }

    // DESPESAS MENSAIS

    const despesaExistente = await tx.despesa.findFirst({
      where: {
        id_Usuario: idUsuario,
        id_Categoria: categoriaDespesa.id_Categoria,
        descricao: "Despesas mensais",
      },
    });

    if (despesasMensais > 0) {
      if (despesaExistente) {
        await tx.despesa.update({
          where: {
            id_Despesa: despesaExistente.id_Despesa,
          },
          data: {
            valor: despesasMensais,
          },
        });
      } else {
        await tx.despesa.create({
          data: {
            id_Usuario: idUsuario,
            id_Categoria: categoriaDespesa.id_Categoria,
            descricao: "Despesas mensais",
            valor: despesasMensais,
            data_vencimento: dataAtual,
            data_pagamento: null,
            tipo: "FIXA",
            frequencia: "MENSAL",
            status: "PENDENTE",
          },
        });
      }
    } else if (despesaExistente) {
      await tx.despesa.update({
        where: {
          id_Despesa: despesaExistente.id_Despesa,
        },
        data: {
          valor: 0,
        },
      });
    }

    return {
      renda_fixa: rendaFixa,
      renda_variavel: rendaVariavel,
      despesas_mensais: despesasMensais,
    };
  });
}

// SALVAR META E PRAZO DA RESERVA

export async function atualizarReservaFinanceira(
  idUsuario: number,
  dados: DadosReservaFinanceira
) {
  const economiaFutura = validarValorOpcional(
    dados.economia_futura,
    "reserva"
  );

  const tempoEconomia = validarPrazoReserva(
    dados.tempo_economia
  );

  const reserva = await prisma.reservaFinanceira.upsert({
    where: {
      id_Usuario: idUsuario,
    },
    create: {
      id_Usuario: idUsuario,
      valor_atual: 0,
      valor_desejado: economiaFutura ?? 0,
      tempo_economia: tempoEconomia,
    },
    update: {
      ...(economiaFutura !== null && {
        valor_desejado: economiaFutura,
      }),
      ...(tempoEconomia !== null && {
        tempo_economia: tempoEconomia,
      }),
    },
  });

  return reserva;
}

// BUSCAR DADOS FINANCEIROS

export async function buscarPerfilFinanceiro(idUsuario: number) {
  const [
    rendaFixa,
    rendaVariavel,
    despesas,
    reserva,
  ] = await Promise.all([
    prisma.receita.findFirst({
      where: {
        id_Usuario: idUsuario,
        descricao: "Renda fixa mensal",
      },
    }),

    prisma.receita.findFirst({
      where: {
        id_Usuario: idUsuario,
        descricao: "Renda variável mensal",
      },
    }),

    prisma.despesa.findFirst({
      where: {
        id_Usuario: idUsuario,
        descricao: "Despesas mensais",
      },
    }),

    prisma.reservaFinanceira.findUnique({
      where: {
        id_Usuario: idUsuario,
      },
    }),
  ]);

  return {
    renda_fixa: rendaFixa
      ? Number(rendaFixa.valor)
      : null,

    renda_variavel: rendaVariavel
      ? Number(rendaVariavel.valor)
      : null,

    despesas_mensais: despesas
      ? Number(despesas.valor)
      : 0,

    economia_futura: reserva
      ? Number(reserva.valor_desejado)
      : null,

    tempo_economia: reserva?.tempo_economia ?? null,
  };
}
