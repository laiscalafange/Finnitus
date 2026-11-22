
import { prisma } from "../lib/prisma.js";

type DadosPerfilFinanceiro = {
  renda_fixa: number | null;
  renda_variavel: number | null;
  despesas_mensais: number;
};

type DadosReserva = {
  economia_futura: number | null;
  tempo_economia: number | null;
};

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

function validarValor(valor: number | null, campo: string) {
  if (
    valor !== null &&
    (!Number.isFinite(valor) || valor < 0)
  ) {
    throw new Error(`O valor de ${campo} é inválido.`);
  }
}

// SALVAR RENDA FIXA, RENDA VARIÁVEL E DESPESAS

export async function salvarPerfilFinanceiro(
  idUsuario: number,
  dados: DadosPerfilFinanceiro
) {
  validarValor(dados.renda_fixa, "renda fixa");
  validarValor(dados.renda_variavel, "renda variável");
  validarValor(dados.despesas_mensais, "despesas");

  if (!Number.isFinite(dados.despesas_mensais)) {
    throw new Error("O valor das despesas é inválido.");
  }

  return prisma.$transaction(async (tx) => {
    // Categorias utilizadas pelos registros do onboarding.

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

    // RENDA FIXA

    const rendaFixaExistente = await tx.receita.findFirst({
      where: {
        id_Usuario: idUsuario,
        id_Categoria: categoriaRendaFixa.id_Categoria,
        descricao: "Renda fixa mensal",
      },
    });

    if (dados.renda_fixa !== null && dados.renda_fixa > 0) {
      const dadosReceita = {
        id_Usuario: idUsuario,
        id_Categoria: categoriaRendaFixa.id_Categoria,
        descricao: "Renda fixa mensal",
        valor: dados.renda_fixa,
        data_recebimento: dataAtual,
        tipo: "FIXA" as const,
        status: "PENDENTE" as const,
        frequencia: "MENSAL" as const,
      };

      if (rendaFixaExistente) {
        await tx.receita.update({
          where: {
            id_Receita: rendaFixaExistente.id_Receita,
          },
          data: {
            valor: dados.renda_fixa,
          },
        });
      } else {
        await tx.receita.create({
          data: dadosReceita,
        });
      }
    } else if (rendaFixaExistente) {
      // Não exclui o registro: apenas atualiza o valor para zero.
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

    if (
      dados.renda_variavel !== null &&
      dados.renda_variavel > 0
    ) {
      const dadosReceita = {
        id_Usuario: idUsuario,
        id_Categoria: categoriaRendaVariavel.id_Categoria,
        descricao: "Renda variável mensal",
        valor: dados.renda_variavel,
        data_recebimento: dataAtual,
        tipo: "VARIAVEL" as const,
        status: "PENDENTE" as const,
        frequencia: "MENSAL" as const,
      };

      if (rendaVariavelExistente) {
        await tx.receita.update({
          where: {
            id_Receita: rendaVariavelExistente.id_Receita,
          },
          data: {
            valor: dados.renda_variavel,
          },
        });
      } else {
        await tx.receita.create({
          data: dadosReceita,
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

    if (dados.despesas_mensais > 0) {
      const dadosDespesa = {
        id_Usuario: idUsuario,
        id_Categoria: categoriaDespesa.id_Categoria,
        descricao: "Despesas mensais",
        valor: dados.despesas_mensais,
        data_vencimento: dataAtual,
        data_pagamento: null,
        tipo: "FIXA" as const,
        frequencia: "MENSAL" as const,
        status: "PENDENTE" as const,
      };

      if (despesaExistente) {
        // Atualiza somente o valor, preservando pagamento e vencimento.
        await tx.despesa.update({
          where: {
            id_Despesa: despesaExistente.id_Despesa,
          },
          data: {
            valor: dados.despesas_mensais,
          },
        });
      } else {
        await tx.despesa.create({
          data: dadosDespesa,
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
      renda_fixa: dados.renda_fixa,
      renda_variavel: dados.renda_variavel,
      despesas_mensais: dados.despesas_mensais,
    };
  });
}

// SALVAR META E PRAZO DA RESERVA

export async function atualizarReservaFinanceira(
  idUsuario: number,
  dados: DadosReserva
) {
  validarValor(dados.economia_futura, "reserva");

  if (
    dados.tempo_economia !== null &&
    (!Number.isInteger(dados.tempo_economia) ||
      dados.tempo_economia < 1)
  ) {
    throw new Error("O prazo da reserva é inválido.");
  }

  const reserva = await prisma.reservaFinanceira.upsert({
    where: {
      id_Usuario: idUsuario,
    },
    create: {
      id_Usuario: idUsuario,
      valor_atual: 0,
      valor_desejado: dados.economia_futura ?? 0,
      tempo_economia: dados.tempo_economia,
    },
    update: {
      ...(dados.economia_futura !== null && {
        valor_desejado: dados.economia_futura,
      }),
      ...(dados.tempo_economia !== null && {
        tempo_economia: dados.tempo_economia,
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
    renda_fixa: rendaFixa ? Number(rendaFixa.valor) : null,
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
