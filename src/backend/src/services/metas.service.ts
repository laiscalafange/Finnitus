import { notificarMetaCriada, notificarMetaConcluida, notificarMovimentoMeta } from "./notificacoes.gatilhos.js";
import { prisma } from "../lib/prisma.js";

import { HttpError } from "../utils/errors.js";

type TipoMeta = "LONGO_PRAZO" | "MENSAL";

type PrioridadeMeta =

  | "BAIXA"

  | "MEDIA"

  | "ALTA";

type StatusMeta =

  | "EM_ANDAMENTO"

  | "CONCLUIDA"

  | "CANCELADA";

type CriarMetaDados = {

  id_Usuario: number;

  nome: string;

  tipo: TipoMeta;

  valorObjetivo: number;

  valorInicial?: number;

  valorPeriodo?: number;

  dataLimite?: string;

  mesReferencia?: string;

  prioridade?: PrioridadeMeta;

  configurada?: boolean;

};

type AtualizarMetaDados = {

  nome?: string;

  tipo?: TipoMeta;

  valorObjetivo?: number;

  valorPeriodo?: number | null;

  dataLimite?: string | null;

  mesReferencia?: string | null;

  prioridade?: PrioridadeMeta;

};

function criarData(data: string): Date {

  const resultado = new Date(

    `${data}T00:00:00.000Z`,

  );

  if (Number.isNaN(resultado.getTime())) {

    throw new HttpError(

      400,

      "Data inválida.",

    );

  }

  return resultado;

}

function criarMesReferencia(

  mes: string,

): Date {

  if (!/^\d{4}-\d{2}$/.test(mes)) {

    throw new HttpError(

      400,

      "O mês deve estar no formato YYYY-MM.",

    );

  }

  const data = new Date(

   `${mes}-01T00:00:00.000Z`,

  );

  if (Number.isNaN(data.getTime())) {

    throw new HttpError(

      400,

      "Mês de referência inválido.",

    );

  }

  return data;

}

function formatarMeta(meta: any) {

  const objetivo = Number(

    meta.Mvalor_objetivo,

  );

  const atual = Number(

    meta.Mvalor_atual,

  );

  const valorPeriodo =

    meta.Mvalor_periodo === null

      ? null

      : Number(meta.Mvalor_periodo);

  const progresso =

    objetivo > 0

      ? Math.min(

          100,

          (atual / objetivo) * 100,

        )

      : 0;

  return {

    ...meta,

    Mvalor_objetivo: objetivo,

    Mvalor_atual: atual,

    Mvalor_periodo: valorPeriodo,

    progresso,

  };

}

export async function criarMeta(

  dados: CriarMetaDados,

) {

  const nome = dados.nome?.trim();

  if (!nome) {

    throw new HttpError(

      400,

      "O nome da meta é obrigatório.",

    );

  }

  if (

    !Number.isFinite(dados.valorObjetivo) ||

    dados.valorObjetivo <= 0

  ) {

    throw new HttpError(

      400,

      "O valor do objetivo deve ser maior que zero.",

    );

  }

  const valorInicial =

    dados.valorInicial ?? 0;

  if (

    !Number.isFinite(valorInicial) ||

    valorInicial < 0

  ) {

    throw new HttpError(

      400,

      "O valor inicial não pode ser negativo.",

    );

  }

  if (

    dados.tipo !== "MENSAL" &&

    dados.tipo !== "LONGO_PRAZO"

  ) {

    throw new HttpError(

      400,

      "Tipo de meta inválido.",

    );

  }

  if (

    dados.tipo === "MENSAL" &&

    !dados.mesReferencia

  ) {

    throw new HttpError(

      400,

      "Informe o mês da meta mensal.",

    );

  }

  if (

    dados.valorPeriodo !== undefined &&

    (

      !Number.isFinite(

        dados.valorPeriodo,

      ) ||

      dados.valorPeriodo < 0

    )

  ) {

    throw new HttpError(

      400,

      "O valor periódico não pode ser negativo.",

    );

  }

  const mesReferencia =

    dados.tipo === "MENSAL"

      ? criarMesReferencia(

          dados.mesReferencia!,

        )

      : null;

  const prazo =

    dados.dataLimite

      ? criarData(dados.dataLimite)

      : null;

  const concluida =

    valorInicial >=

    dados.valorObjetivo;

  const resultado =

    await prisma.$transaction(

      async (tx) => {

        const meta =

          await tx.meta.create({

            data: {

              id_Usuario:

                dados.id_Usuario,

              Mnome: nome,

              Mvalor_objetivo:

                dados.valorObjetivo,

              Mvalor_atual:

                valorInicial,

              Mvalor_periodo:

                dados.valorPeriodo ??

                null,

              Mtipo: dados.tipo,

              Mmes_referencia:

                mesReferencia,

              Mprazo: prazo,

              Mprioridade:

                dados.prioridade ??

                "MEDIA",

              Mstatus: concluida

                ? "CONCLUIDA"

                : "EM_ANDAMENTO",

              // Metas comuns ficam configuradas por padrão; o onboarding envia false.
              Mconfigurada: dados.configurada ?? true,

              Mdata_conclusao:

                concluida

                  ? new Date()

                  : null,

            },

          });

        if (valorInicial > 0) {

          await tx.movimentacaoMeta.create({

            data: {

              id_Meta:

                meta.id_Meta,

              valor:

                valorInicial,

              tipo: "APORTE",

              data:

                new Date(),

              descricao:

                "Valor inicial da meta",

            },

          });

        }

        await notificarMetaCriada(tx, meta);
        if (concluida) await notificarMetaConcluida(tx, meta);

        return meta;

      },

    );

  return formatarMeta(resultado);

}

export async function listarMetas(

  id_Usuario: number,

  mes?: string,

) {

  const referencia =

    mes

      ? criarMesReferencia(mes)

      : criarMesReferencia(

          new Date()

            .toISOString()

            .slice(0, 7),

        );

  const [

    mensais,

    longoPrazo,

  ] = await Promise.all([

    prisma.meta.findMany({

  where: {

    id_Usuario,

    Mtipo: "MENSAL",

    Mmes_referencia: referencia,

    Mstatus: "EM_ANDAMENTO",

  },

  include: {

    MovimentacaoMeta: {

      orderBy: {

        data: "desc",

      },

    },

  },

  orderBy: {

    Mdata_criacao: "desc",

  },

}),

    prisma.meta.findMany({

  where: {

    id_Usuario,

    Mtipo: "LONGO_PRAZO",

    Mstatus: "EM_ANDAMENTO",

  },

  include: {

    MovimentacaoMeta: {

      orderBy: {

        data: "desc",

      },

    },

  },

  orderBy: {

    Mdata_criacao: "desc",

  },

}),

  ]);

  return {

    mensais:

      mensais.map(formatarMeta),

    longoPrazo:

      longoPrazo.map(formatarMeta),

  };

}

export async function buscarMeta(

  id_Usuario: number,

  id_Meta: number,

) {

  const meta =

    await prisma.meta.findFirst({

      where: {

        id_Meta,

        id_Usuario,

      },

      include: {

        MovimentacaoMeta: {

          orderBy: {

            data: "desc",

          },

        },

      },

    });

  if (!meta) {

    throw new HttpError(

      404,

      "Meta não encontrada.",

    );

  }

  return {

    ...formatarMeta(meta),

    MovimentacaoMeta:

      meta.MovimentacaoMeta.map(

        (movimentacao) => ({

          ...movimentacao,

          valor: Number(

            movimentacao.valor,

          ),

        }),

      ),

  };

}


export async function atualizarMeta(
  id_Usuario: number,
  id_Meta: number,
  dados: AtualizarMetaDados,
) {
  const meta = await prisma.meta.findFirst({
    where: {
      id_Meta,
      id_Usuario,
    },
  });

  if (!meta) {
    throw new HttpError(404, "Meta não encontrada.");
  }

  if (meta.Mstatus === "CANCELADA") {
    throw new HttpError(
      400,
      "Não é possível editar uma meta cancelada.",
    );
  }

  const tipo = dados.tipo ?? meta.Mtipo;

  let mesReferencia = meta.Mmes_referencia;

  if (tipo === "MENSAL") {
    if (dados.mesReferencia) {
      mesReferencia = criarMesReferencia(
        dados.mesReferencia,
      );
    }

    if (!mesReferencia) {
      throw new HttpError(
        400,
        "Informe o mês da meta mensal.",
      );
    }
  } else {
    mesReferencia = null;
  }

  let prazo = meta.Mprazo;

  if (dados.dataLimite === null) {
    prazo = null;
  } else if (dados.dataLimite) {
    prazo = criarData(dados.dataLimite);
  }

  const objetivo =
    dados.valorObjetivo ?? Number(meta.Mvalor_objetivo);

  if (!Number.isFinite(objetivo) || objetivo <= 0) {
    throw new HttpError(
      400,
      "O valor do objetivo deve ser maior que zero.",
    );
  }

  const atual = Number(meta.Mvalor_atual);
  const concluida = atual >= objetivo;

  const atualizada = await prisma.$transaction(async (tx) => {
    const atualizada = await tx.meta.update({
    where: {
      id_Meta,
      id_Usuario,
    },
    data: {
      Mnome: dados.nome?.trim() || meta.Mnome,
      Mtipo: tipo,
      Mvalor_objetivo: objetivo,
      Mvalor_periodo:
        dados.valorPeriodo === undefined
          ? meta.Mvalor_periodo
          : dados.valorPeriodo,
      Mmes_referencia: mesReferencia,
      Mprazo: prazo,
      Mprioridade:
        dados.prioridade ?? meta.Mprioridade,

      // Marca a meta como configurada após registrar o valor limite.
      Mconfigurada:
        meta.Mconfigurada ||
        dados.valorObjetivo !== undefined,

      Mstatus: concluida
        ? "CONCLUIDA"
        : "EM_ANDAMENTO",

      Mdata_conclusao: concluida
        ? meta.Mdata_conclusao ?? new Date()
        : null,
    },
    });

    if (!meta.Mconfigurada && atualizada.Mconfigurada) {
      await notificarMetaCriada(tx, atualizada);
    }
    if (meta.Mstatus !== "CONCLUIDA" && atualizada.Mstatus === "CONCLUIDA") {
      await notificarMetaConcluida(tx, atualizada);
    }
    return atualizada;
  });

  return formatarMeta(atualizada);
}

export async function adicionarAporte(

  id_Usuario: number,

  id_Meta: number,

  valor: number,

  descricao?: string,

) {

  if (

    !Number.isFinite(valor) ||

    valor <= 0

  ) {

    throw new HttpError(

      400,

      "O valor do aporte deve ser maior que zero.",

    );

  }

  return prisma.$transaction(

    async (tx) => {

      const meta =

        await tx.meta.findFirst({

          where: {

            id_Meta,

            id_Usuario,

          },

        });

      if (!meta) {

        throw new HttpError(

          404,

          "Meta não encontrada.",

        );

      }

      if (

        meta.Mstatus ===

        "CANCELADA"

      ) {

        throw new HttpError(

          400,

          "Não é possível fazer aporte em uma meta cancelada.",

        );

      }

      const movimentacao =

        await tx.movimentacaoMeta.create({

          data: {

            id_Meta,

            valor,

            tipo:

              "APORTE",

            data:

              new Date(),

            descricao:

              descricao?.trim() ||

              "Aporte na meta",

          },

        });

      const atualizada =

        await tx.meta.update({

          where: {

            id_Meta,

            id_Usuario,

          },

          data: {

            Mvalor_atual: {

              increment: valor,

            },

          },

        });

      const objetivo =

        Number(

          atualizada.Mvalor_objetivo,

        );

      const atual =

        Number(

          atualizada.Mvalor_atual,

        );

      let metaFinal =

        atualizada;

      if (

        atual >= objetivo &&

        atualizada.Mstatus !==

          "CONCLUIDA"

      ) {

        metaFinal =

          await tx.meta.update({

            where: {

              id_Meta,

              id_Usuario,

            },

            data: {

              Mstatus:

                "CONCLUIDA",

              Mdata_conclusao:

                new Date(),

            },

          });

      }

      await notificarMovimentoMeta(tx, metaFinal, movimentacao);
      if (meta.Mstatus !== "CONCLUIDA" && metaFinal.Mstatus === "CONCLUIDA") {
        await notificarMetaConcluida(tx, metaFinal);
      }

      return {

        meta:

          formatarMeta(

            metaFinal,

          ),

        movimentacao: {

          ...movimentacao,

          valor: Number(

            movimentacao.valor,

          ),

        },

      };

    },

  );

}

export async function retirarDaMeta(

  id_Usuario: number,

  id_Meta: number,

  valor: number,

  descricao?: string,

) {

  if (

    !Number.isFinite(valor) ||

    valor <= 0

  ) {

    throw new HttpError(

      400,

      "O valor da retirada deve ser maior que zero.",

    );

  }

  return prisma.$transaction(

    async (tx) => {

      const meta =

        await tx.meta.findFirst({

          where: {

            id_Meta,

            id_Usuario,

          },

        });

      if (!meta) {

        throw new HttpError(

          404,

          "Meta não encontrada.",

        );

      }

      if (

        meta.Mstatus ===

        "CANCELADA"

      ) {

        throw new HttpError(

          400,

          "Não é possível retirar valores de uma meta cancelada.",

        );

      }

      const atual =

        Number(

          meta.Mvalor_atual,

        );

      if (valor > atual) {

        throw new HttpError(

          400,

          "O valor da retirada não pode ser maior que o valor guardado.",

        );

      }

      const movimentacao =

        await tx.movimentacaoMeta.create({

          data: {

            id_Meta,

            valor,

            tipo:

              "RETIRADA",

            data:

              new Date(),

            descricao:

              descricao?.trim() ||

              "Retirada da meta",

          },

        });

      const metaAtualizada =

        await tx.meta.update({

          where: {

            id_Meta,

            id_Usuario,

          },

          data: {

            Mvalor_atual: {

              decrement: valor,

            },

            Mstatus:

              "EM_ANDAMENTO",

            Mdata_conclusao:

              null,

          },

        });

      await notificarMovimentoMeta(tx, metaAtualizada, movimentacao);

      return {

        meta:

          formatarMeta(

            metaAtualizada,

          ),

        movimentacao: {

          ...movimentacao,

          valor: Number(

            movimentacao.valor,

          ),

        },

      };

    },

  );

}

export async function cancelarMeta(

  id_Usuario: number,

  id_Meta: number,

) {

  const meta =

    await prisma.meta.findFirst({

      where: {

        id_Meta,

        id_Usuario,

      },

    });

  if (!meta) {

    throw new HttpError(

      404,

      "Meta não encontrada.",

    );

  }

  if (

    meta.Mstatus ===

    "CANCELADA"

  ) {

    throw new HttpError(

      400,

      "A meta já está cancelada.",

    );

  }

  const atualizada =

    await prisma.meta.update({

      where: {

        id_Meta,

        id_Usuario,

      },

      data: {

        Mstatus:

          "CANCELADA",

        Mdata_cancelamento:

          new Date(),

      },

    });

  return formatarMeta(atualizada);

}

// Desfaz um cancelamento ou uma conclusão: a meta volta para "em andamento".

// O valor guardado não muda (se a meta foi concluída, ela volta com o valor

// já atingido; a pessoa pode retirar ou depositar normalmente depois).

export async function reabrirMeta(

  id_Usuario: number,

  id_Meta: number,

) {

  const meta =

    await prisma.meta.findFirst({

      where: {

        id_Meta,

        id_Usuario,

      },

    });

  if (!meta) {

    throw new HttpError(

      404,

      "Meta não encontrada.",

    );

  }

  if (

    meta.Mstatus ===

    "EM_ANDAMENTO"

  ) {

    throw new HttpError(

      400,

      "A meta já está em andamento.",

    );

  }

  // Meta do mês só aparece na tela Metas no mês dela: reabrir uma de um

  // mês que já passou faria a meta sumir de todas as telas.

  if (

    meta.Mtipo === "MENSAL" &&

    meta.Mmes_referencia

  ) {

    const mesAtual =

      criarMesReferencia(

        new Date()

          .toISOString()

          .slice(0, 7),

      );

    if (

      meta.Mmes_referencia.getTime() <

      mesAtual.getTime()

    ) {

      throw new HttpError(

        400,

        "Metas do mês de meses anteriores não podem ser reabertas.",

      );

    }

  }

  const atualizada =

    await prisma.meta.update({

      where: {

        id_Meta,

        id_Usuario,

      },

      data: {

        Mstatus:

          "EM_ANDAMENTO",

        Mdata_conclusao:

          null,

        Mdata_cancelamento:

          null,

      },

    });

  return formatarMeta(atualizada);

}

export async function listarHistorico(

  id_Usuario: number,

  status?: StatusMeta,

) {

  if (

    status &&

    status !== "CONCLUIDA" &&

    status !== "CANCELADA"

  ) {

    throw new HttpError(

      400,

      "Status de histórico inválido.",

    );

  }

    const metas = await prisma.meta.findMany({

  where: {

    id_Usuario,

    ...(status

      ? {

          Mstatus: status,

        }

      : {

          Mstatus: {

            in: [

              "CONCLUIDA",

              "CANCELADA",

            ],

          },

        }),

  },

  include: {

    MovimentacaoMeta: {

      orderBy: {

        data: "desc",

      },

    },

  },

  orderBy: {

    Mdata_criacao: "desc",

  },

});

  return metas.map(

    formatarMeta,

  );

}

export async function obterAnalises(

  id_Usuario: number,

) {

  const metas =

    await prisma.meta.findMany({

      where: {

        id_Usuario,

        Mstatus: {

          not: "CANCELADA",

        },

      },

      include: {

        MovimentacaoMeta: {

          orderBy: {

            data: "asc",

          },

        },

      },

    });

  const totalGuardado =

    metas.reduce(

      (total, meta) =>

        total +

        Number(

          meta.Mvalor_atual,

        ),

      0,

    );

  const emAndamento =

    metas.filter(

      (meta) =>

        meta.Mstatus ===

        "EM_ANDAMENTO",

    ).length;

  const concluidas =

    metas.filter(

      (meta) =>

        meta.Mstatus ===

        "CONCLUIDA",

    ).length;

  const progresso =

    metas.map(

      (meta) => {

        const objetivo =

          Number(

            meta.Mvalor_objetivo,

          );

        const atual =

          Number(

            meta.Mvalor_atual,

          );

        return {

          id_Meta:

            meta.id_Meta,

          nome:

            meta.Mnome,

          valorObjetivo:

            objetivo,

          valorAtual:

            atual,

          percentual:

            objetivo > 0

              ? Math.min(

                  100,

                  (

                    atual /

                    objetivo

                  ) * 100,

                )

              : 0,

          status:

            meta.Mstatus,

        };

      },

    );

  const aportes =

    metas

      .flatMap(

        (meta) =>

          meta.MovimentacaoMeta

            .filter(

              (

                movimentacao,

              ) =>

                movimentacao.tipo ===

                "APORTE",

            )

            .map(

              (

                movimentacao,

              ) => ({

                id_Movimentacao:

                  movimentacao.id_Movimentacao,

                id_Meta:

                  meta.id_Meta,

                nomeMeta:

                  meta.Mnome,

                valor:

                  Number(

                    movimentacao.valor,

                  ),

                data:

                  movimentacao.data,

              }),

            ),

      )

      .sort(

        (a, b) =>

          a.data.getTime() -

          b.data.getTime(),

      );

  return {

    totalGuardado,

    emAndamento,

    concluidas,

    progresso,

    habitoGuardar:

      aportes,

  };

}

/**
 * Registra os objetivos escolhidos durante o onboarding.
 * Eles são salvos como metas ainda não configuradas, pois o usuário
 * definirá valores, prazos e prioridades posteriormente.
 */
export async function registrarMetasIniciais(
  id_Usuario: number,
  nomes: string[],
) {
  if (!Array.isArray(nomes)) {
    throw new HttpError(400, "Informe uma lista válida de objetivos.");
  }

  // Remove espaços extras, nomes vazios e opções repetidas.
  const nomesValidos = [
    ...new Set(
      nomes
        .filter((nome) => typeof nome === "string")
        .map((nome) => nome.trim())
        .filter((nome) => nome.length > 0),
    ),
  ];

  if (nomesValidos.length > 10) {
    throw new HttpError(400, "Selecione no máximo 10 objetivos.");
  }

  if (nomesValidos.some((nome) => nome.length > 100)) {
    throw new HttpError(
      400,
      "O nome de cada objetivo deve ter até 100 caracteres.",
    );
  }

  const metas = await prisma.$transaction(async (tx) => {
    // Evita cadastrar novamente objetivos iniciais já enviados pelo usuário.
    const existentes = await tx.meta.findMany({
      where: {
        id_Usuario,
        Mconfigurada: false,
        Mnome: { in: nomesValidos },
      },
      select: { Mnome: true },
    });

    const nomesExistentes = new Set(
      existentes.map((meta) => meta.Mnome.toLowerCase()),
    );

    const novosNomes = nomesValidos.filter(
      (nome) => !nomesExistentes.has(nome.toLowerCase()),
    );

    // Cria cada objetivo sem valor, prazo ou movimentação financeira.
    for (const nome of novosNomes) {
      await tx.meta.create({
        data: {
          id_Usuario,
          Mnome: nome,
          Mvalor_objetivo: 0,
          Mvalor_atual: 0,
          Mvalor_periodo: null,
          Mtipo: "LONGO_PRAZO",
          Mmes_referencia: null,
          Mprazo: null,
          Mprioridade: "MEDIA",
          Mstatus: "EM_ANDAMENTO",
          Mconfigurada: false,
        },
      });
    }

    // Retorna os objetivos iniciais desse usuário que foram solicitados.
    return tx.meta.findMany({
      where: {
        id_Usuario,
        Mconfigurada: false,
        Mnome: { in: nomesValidos },
      },
      orderBy: { Mdata_criacao: "asc" },
    });
  });

  return metas.map(formatarMeta);
}
