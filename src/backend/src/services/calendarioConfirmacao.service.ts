import { notificarDespesaCriada, notificarEventoConfirmado, notificarReceitaCriada } from "./notificacoes.gatilhos.js";
import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

type DadosEventoExterno = {
  id_Usuario: number;

  idEventoExterno: string;

  tituloEvento: string;

  dataInicio: string;

  dataFim?: string;

  diaInteiro?: boolean;
};

type ConfirmarEventoFinanceiroInput =
  DadosEventoExterno & {
    tipoMovimentacao:
      | "RECEITA"
      | "DESPESA";

    descricao: string;

    valor: number;

    data: string;
  };

async function buscarEventoParaClassificar(tx: Prisma.TransactionClient, dados: DadosEventoExterno) {
  // Serializa classificações da mesma conta mesmo quando o evento ainda não existe.
  await tx.$queryRaw`
    SELECT "id_Usuario" FROM "Usuario" WHERE "id_Usuario" = ${dados.id_Usuario}
    FOR NO KEY UPDATE
  `;
  return tx.evento.findFirst({
    where: { id_Usuario: dados.id_Usuario, id_evento_externo: dados.idEventoExterno },
  });
}

/*
 * =====================================================
 * MARCAR EVENTO COMO NÃO FINANCEIRO
 * =====================================================
 */

export async function marcarEventoNaoFinanceiro(
  dados: DadosEventoExterno
) {
  return prisma.$transaction(async (tx) => {
    const eventoExistente = await buscarEventoParaClassificar(tx, dados);
    if (eventoExistente?.status_financeiro === "CONFIRMADO" || eventoExistente?.id_Receita || eventoExistente?.id_Despesa) {
      throw new Error("Este evento já foi confirmado como movimentação financeira.");
    }

    const data = {
      Enome: dados.tituloEvento,
      data_inicio: new Date(dados.dataInicio),
      data_fim: dados.dataFim ? new Date(dados.dataFim) : null,
      dia_inteiro: dados.diaInteiro ?? false,
      tipo: "OUTRO",
      origem: "DISPOSITIVO",
      status_financeiro: "NAO_FINANCEIRO",
      valor_relacionado: null,
    } as const;

    if (eventoExistente) {
      return tx.evento.update({
        where: { id_Evento: eventoExistente.id_Evento, id_Usuario: dados.id_Usuario },
        data,
      });
    }

    return tx.evento.create({
      data: { ...data, id_Usuario: dados.id_Usuario, id_evento_externo: dados.idEventoExterno },
    });
  });
}

/*
 * =====================================================
 * CONFIRMAR EVENTO COMO RECEITA OU DESPESA
 * =====================================================
 */

export async function confirmarEventoFinanceiro(
  dados: ConfirmarEventoFinanceiroInput
) {
  return prisma.$transaction(
    async (tx) => {
      const eventoExistente = await buscarEventoParaClassificar(tx, dados);

      /*
       * Evento que já virou Receita ou Despesa
       * não pode ser processado novamente.
       */
      if (
        eventoExistente?.status_financeiro ===
          "CONFIRMADO" ||
        eventoExistente?.id_Receita ||
        eventoExistente?.id_Despesa
      ) {
        throw new Error(
          "Este evento já foi processado."
        );
      }

      /*
       * =================================================
       * DESPESA
       * =================================================
       */

      if (
        dados.tipoMovimentacao ===
        "DESPESA"
      ) {
        const despesa =
          await tx.despesa.create({
            data: {
              id_Usuario:
                dados.id_Usuario,

              descricao:
                dados.descricao,

              valor:
                dados.valor,

              data_vencimento:
                new Date(
                  dados.data
                ),

              tipo:
                "VARIAVEL",

              frequencia:
                "UNICA",

              status:
                "PENDENTE",
            },
          });

        let evento;

        /*
         * Se ele já estava salvo como
         * NAO_FINANCEIRO, reaproveitamos
         * o registro.
         */
        if (eventoExistente) {
          evento =
            await tx.evento.update({
              where: {
                id_Evento:
                  eventoExistente.id_Evento,
                id_Usuario: dados.id_Usuario,
              },

              data: {
                Enome:
                  dados.tituloEvento,

                Edescricao:
                  dados.descricao,

                data_inicio:
                  new Date(
                    dados.dataInicio
                  ),

                data_fim:
                  dados.dataFim
                    ? new Date(
                        dados.dataFim
                      )
                    : null,

                dia_inteiro:
                  dados.diaInteiro ??
                  false,

                tipo:
                  "PAGAMENTO",

                origem:
                  "DISPOSITIVO",

                status_financeiro:
                  "CONFIRMADO",

                valor_relacionado:
                  dados.valor,

                id_Despesa:
                  despesa.id_Despesa,

                id_Receita:
                  null,
              },
            });
        } else {
          evento =
            await tx.evento.create({
              data: {
                id_Usuario:
                  dados.id_Usuario,

                Enome:
                  dados.tituloEvento,

                Edescricao:
                  dados.descricao,

                data_inicio:
                  new Date(
                    dados.dataInicio
                  ),

                data_fim:
                  dados.dataFim
                    ? new Date(
                        dados.dataFim
                      )
                    : null,

                dia_inteiro:
                  dados.diaInteiro ??
                  false,

                tipo:
                  "PAGAMENTO",

                origem:
                  "DISPOSITIVO",

                id_evento_externo:
                  dados.idEventoExterno,

                status_financeiro:
                  "CONFIRMADO",

                valor_relacionado:
                  dados.valor,

                id_Despesa:
                  despesa.id_Despesa,
              },
            });
        }

        await notificarDespesaCriada(tx, despesa);
        await notificarEventoConfirmado(tx, evento);
        return {
          tipo: "DESPESA",
          movimentacao: despesa,
          evento,
        };
      }

      /*
       * =================================================
       * RECEITA
       * =================================================
       */

      const receita =
        await tx.receita.create({
          data: {
            id_Usuario:
              dados.id_Usuario,

            descricao:
              dados.descricao,

            valor:
              dados.valor,

            data_recebimento:
              new Date(
                dados.data
              ),

            tipo:
              "VARIAVEL",

            frequencia:
              "UNICA",

            status:
              "RECEBIDA",
          },
        });

      let evento;

      if (eventoExistente) {
        evento =
          await tx.evento.update({
            where: {
              id_Evento:
                eventoExistente.id_Evento,
            },

            data: {
              Enome:
                dados.tituloEvento,

              Edescricao:
                dados.descricao,

              data_inicio:
                new Date(
                  dados.dataInicio
                ),

              data_fim:
                dados.dataFim
                  ? new Date(
                      dados.dataFim
                    )
                  : null,

              dia_inteiro:
                dados.diaInteiro ??
                false,

              tipo:
                "RECEBIMENTO",

              origem:
                "DISPOSITIVO",

              status_financeiro:
                "CONFIRMADO",

              valor_relacionado:
                dados.valor,

              id_Receita:
                receita.id_Receita,

              id_Despesa:
                null,
            },
          });
      } else {
        evento =
          await tx.evento.create({
            data: {
              id_Usuario:
                dados.id_Usuario,

              Enome:
                dados.tituloEvento,

              Edescricao:
                dados.descricao,

              data_inicio:
                new Date(
                  dados.dataInicio
                ),

              data_fim:
                dados.dataFim
                  ? new Date(
                      dados.dataFim
                    )
                  : null,

              dia_inteiro:
                dados.diaInteiro ??
                false,

              tipo:
                "RECEBIMENTO",

              origem:
                "DISPOSITIVO",

              id_evento_externo:
                dados.idEventoExterno,

              status_financeiro:
                "CONFIRMADO",

              valor_relacionado:
                dados.valor,

              id_Receita:
                receita.id_Receita,
            },
          });
      }

      await notificarReceitaCriada(tx, receita);
      await notificarEventoConfirmado(tx, evento);
      return {
        tipo: "RECEITA",
        movimentacao: receita,
        evento,
      };
    }
  );
}
