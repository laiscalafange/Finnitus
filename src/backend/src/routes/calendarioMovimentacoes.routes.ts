import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

/**
 * Rotas de edição de uma receita ou despesa já existente no banco.
 * Montadas em /calendario no routes/index.ts.
 *
 * PUT /calendario/movimentacoes/RECEITA/5
 * PUT /calendario/movimentacoes/DESPESA/9
 * Body: { "descricao": "Mercado", "valor": 95.50, "data": "2026-10-28" }
 */

const router = Router();
router.use(authMiddleware);

type TipoMovimentacao = "RECEITA" | "DESPESA";

function converterData(data: unknown): Date | null {
  if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return null;
  }

  const novaData = new Date(`${data}T00:00:00.000Z`);
  if (
    Number.isNaN(novaData.getTime()) ||
    novaData.toISOString().slice(0, 10) !== data
  ) {
    return null;
  }

  return novaData;
}

function mudarDiaMantendoHorario(dataOriginal: Date, novoDia: Date): Date {
  const data = new Date(dataOriginal);
  const inicioDoDiaAnterior = Date.UTC(
    data.getUTCFullYear(),
    data.getUTCMonth(),
    data.getUTCDate(),
  );

  return new Date(novoDia.getTime() + data.getTime() - inicioDoDiaAnterior);
}

router.put(
  "/movimentacoes/:tipo/:id",
  async (req: Request, res: Response) => {
    try {
      const idUsuario = req.userId;
      if (typeof idUsuario !== "number" || !Number.isSafeInteger(idUsuario) || idUsuario <= 0) {
        return res.status(401).json({ mensagem: "Usuário não autenticado." });
      }

      const tipo = String(req.params.tipo ?? "").toUpperCase();
      const idTexto = String(req.params.id ?? "");
      const id = Number(idTexto);

      if (
        (tipo !== "RECEITA" && tipo !== "DESPESA") ||
        !/^\d+$/.test(idTexto) ||
        !Number.isSafeInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({ mensagem: "Tipo ou ID inválido." });
      }

      const dados = (req.body ?? {}) as {
        descricao?: unknown;
        valor?: unknown;
        data?: unknown;
      };

      const descricao =
        typeof dados.descricao === "string" ? dados.descricao.trim() : "";
      const valor = typeof dados.valor === "number" ? dados.valor : NaN;
      const novaData = converterData(dados.data);

      if (
        !descricao ||
        descricao.length > 255 ||
        !Number.isFinite(valor) ||
        valor <= 0 ||
        valor > 99999999.99 ||
        Math.abs(valor * 100 - Math.round(valor * 100)) > 0.000001 ||
        !novaData
      ) {
        return res.status(400).json({
          mensagem: "Informe descrição (até 255 caracteres), valor positivo com no máximo 2 decimais e data AAAA-MM-DD válida.",
        });
      }

      // O Prisma aceita decimal exato como string para campo Decimal(10, 2).
      const valorDecimal = (Math.round(valor * 100) / 100).toFixed(2);
      const tipoMovimentacao = tipo as TipoMovimentacao;

      const resultado = await prisma.$transaction(async (tx) => {
        // updateMany aplica id_Usuario no WHERE, garantindo que o registro
        // pertença ao usuário autenticado (não aceitamos usuário no body).
        const atualizacao = tipoMovimentacao === "RECEITA"
          ? await tx.receita.updateMany({
              where: { id_Receita: id, id_Usuario: idUsuario },
              data: {
                descricao,
                valor: valorDecimal,
                data_recebimento: novaData,
              },
            })
          : await tx.despesa.updateMany({
              where: { id_Despesa: id, id_Usuario: idUsuario },
              data: {
                descricao,
                valor: valorDecimal,
                data_vencimento: novaData,
              },
            });

        if (atualizacao.count !== 1) return null;

        // Atualiza também um Evento vinculado, se existir.
        const evento = await tx.evento.findFirst({
          where: tipoMovimentacao === "RECEITA"
            ? { id_Usuario: idUsuario, id_Receita: id }
            : { id_Usuario: idUsuario, id_Despesa: id },
        });

        if (evento) {
          const dataInicioAtualizada = mudarDiaMantendoHorario(
            evento.data_inicio,
            novaData,
          );
          const deslocamento =
            dataInicioAtualizada.getTime() - evento.data_inicio.getTime();

          await tx.evento.updateMany({
            where: { id_Evento: evento.id_Evento, id_Usuario: idUsuario },
            data: {
              Enome: descricao.slice(0, 100),
              valor_relacionado: valorDecimal,
              data_inicio: dataInicioAtualizada,
              ...(evento.data_fim
                ? {
                    data_fim: new Date(
                      evento.data_fim.getTime() + deslocamento,
                    ),
                  }
                : {}),
            },
          });
        }

        return {
          id,
          tipo: tipoMovimentacao,
          descricao,
          valor: Number(valorDecimal),
          data: dados.data,
        };
      });

      if (!resultado) {
        return res.status(404).json({
          mensagem: "Movimentação não encontrada para este usuário.",
        });
      }

      return res.status(200).json({
        mensagem: "Movimentação atualizada com sucesso.",
        movimentacao: resultado,
      });
    } catch (error) {
      console.error("Erro ao editar movimentação no calendário:", error);
      return res.status(500).json({
        mensagem: "Não foi possível atualizar a movimentação.",
      });
    }
  },
);

export default router;
