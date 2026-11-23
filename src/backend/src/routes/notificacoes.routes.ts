import { Router, type Request, type RequestHandler, type Response } from "express";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { registrarAvisosPeriodicos } from "../services/notificacoes.periodicas.js";

type Dependencias = {
  prisma: PrismaClient;
  autenticar: RequestHandler;
};

function inteiroPositivo(valor: unknown): number | null {
  if (typeof valor !== "string" && typeof valor !== "number") return null;
  if (typeof valor === "string" && !/^\d+$/.test(valor)) return null;

  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 && numero <= 2147483647 ? numero : null;
}

const categorias: Record<string, Prisma.NotificacaoWhereInput> = {
  contas: {
    OR: [
      { relacionadoTipo: null },
      { relacionadoTipo: { notIn: ["META", "EVENTO"] } },
    ],
  },
  metas: { relacionadoTipo: "META" },
  eventos: { relacionadoTipo: "EVENTO" },
};

const camposPublicos = {
  id_Notificacao: true,
  tipo: true,
  titulo: true,
  mensagem: true,
  relacionadoTipo: true,
  relacionadoId: true,
  lida: true,
  criadaEm: true,
  lidaEm: true,
} as const;

export function criarRotasNotificacoes({ prisma, autenticar }: Dependencias) {
  const router = Router();
  const notificacao = prisma.notificacao;

  router.get("/", autenticar, async (req: Request, res: Response): Promise<void> => {
    const idUsuario = inteiroPositivo(req.userId);
    if (idUsuario === null) {
      res.status(401).json({ erro: "Usuário não autenticado." });
      return;
    }

    const limiteInformado = Number(req.query.limite ?? 30);
    const paginaInformada = Number(req.query.pagina ?? 1);
    const limite = Number.isSafeInteger(limiteInformado)
      ? Math.min(100, Math.max(1, limiteInformado))
      : 30;
    const pagina = Number.isSafeInteger(paginaInformada)
      ? Math.min(10000, Math.max(1, paginaInformada))
      : 1;
    const apenasNaoLidas = req.query.apenasNaoLidas === "true";
    const categoria = req.query.categoria;
    const filtroCategoria = categoria === "contas" || categoria === "metas" || categoria === "eventos"
      ? categorias[categoria]
      : {};

    const where = {
      id_Usuario: idUsuario,
      ...(apenasNaoLidas ? { lida: false } : {}),
      ...filtroCategoria,
    };

    try {
      if (pagina === 1) await registrarAvisosPeriodicos(prisma, idUsuario);
      const [notificacoes, totalNaoLidas, total] = await Promise.all([
        notificacao.findMany({
          where,
          orderBy: [
            { criadaEm: "desc" as const },
            { id_Notificacao: "desc" as const },
          ],
          skip: (pagina - 1) * limite,
          take: limite,
          select: camposPublicos,
        }),
        notificacao.count({
          where: { id_Usuario: idUsuario, lida: false },
        }),
        notificacao.count({ where }),
      ]);

      res.status(200).json({ notificacoes, totalNaoLidas, total, pagina, limite });
    } catch (erro) {
      console.error("Erro ao listar notificações:", erro);
      res.status(500).json({ erro: "Não foi possível consultar as notificações." });
    }
  });

  router.patch("/ler-todas", autenticar, async (req: Request, res: Response): Promise<void> => {
    const idUsuario = inteiroPositivo(req.userId);
    if (idUsuario === null) {
      res.status(401).json({ erro: "Usuário não autenticado." });
      return;
    }

    try {
      const resultado = await notificacao.updateMany({
        where: { id_Usuario: idUsuario, lida: false },
        data: { lida: true, lidaEm: new Date() },
      });
      res.status(200).json({ atualizadas: resultado.count });
    } catch (erro) {
      console.error("Erro ao marcar todas como lidas:", erro);
      res.status(500).json({ erro: "Não foi possível atualizar as notificações." });
    }
  });

  async function alterarLeitura(req: Request, res: Response, lida: boolean): Promise<void> {
    const idUsuario = inteiroPositivo(req.userId);
    if (idUsuario === null) {
      res.status(401).json({ erro: "Usuário não autenticado." });
      return;
    }

    const idNotificacao = inteiroPositivo(req.params.id);
    if (idNotificacao === null) {
      res.status(400).json({ erro: "ID de notificação inválido." });
      return;
    }

    try {
      const [notificacaoAtualizada] = await notificacao.updateManyAndReturn({
        where: { id_Notificacao: idNotificacao, id_Usuario: idUsuario },
        data: { lida, lidaEm: lida ? new Date() : null },
        select: camposPublicos,
      });

      if (!notificacaoAtualizada) {
        res.status(404).json({ erro: "Notificação não encontrada." });
        return;
      }

      res.status(200).json({ notificacao: notificacaoAtualizada });
    } catch (erro) {
      console.error("Erro ao alterar a leitura da notificação:", erro);
      res.status(500).json({ erro: "Não foi possível atualizar a notificação." });
    }
  }

  router.patch("/:id/ler", autenticar, async (req: Request, res: Response): Promise<void> => {
    await alterarLeitura(req, res, true);
  });

  router.patch("/:id/nao-lida", autenticar, async (req: Request, res: Response): Promise<void> => {
    await alterarLeitura(req, res, false);
  });

  return router;
}
