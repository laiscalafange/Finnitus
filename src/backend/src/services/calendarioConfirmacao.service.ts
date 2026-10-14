import { prisma } from "../lib/prisma.js";

type ConfirmarEventoFinanceiroInput = {
  id_Usuario: number;

  idEventoExterno: string;

  tituloEvento: string;

  dataInicio: string;

  dataFim?: string;

  diaInteiro?: boolean;

  tipoMovimentacao:
    | "RECEITA"
    | "DESPESA";

  descricao: string;

  valor: number;

  data: string;
};

export async function confirmarEventoFinanceiro(
  dados: ConfirmarEventoFinanceiroInput
) {
  const eventoExistente =
    await prisma.evento.findFirst({
      where: {
        id_Usuario:
          dados.id_Usuario,

        id_evento_externo:
          dados.idEventoExterno,
      },
    });

  if (eventoExistente) {
    throw new Error(
      "Este evento já foi processado."
    );
  }

  return prisma.$transaction(
    async (tx) => {
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

              tipo: "VARIAVEL",

              frequencia: "UNICA",

              status: "PENDENTE",
            },
          });

        const evento =
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

              tipo: "PAGAMENTO",

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

        return {
          tipo: "DESPESA",
          movimentacao: despesa,
          evento,
        };
      }

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

            tipo: "VARIAVEL",

            frequencia: "UNICA",

            status: "ATIVA",
          },
        });

      const evento =
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

            tipo: "RECEBIMENTO",

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

      return {
        tipo: "RECEITA",
        movimentacao: receita,
        evento,
      };
    }
  );
}