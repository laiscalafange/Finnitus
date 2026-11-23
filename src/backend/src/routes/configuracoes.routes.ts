import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rateLimit.middleware.js";
import {
  buscarConfiguracaoUsuario,
  excluirDadosFinanceiros,
  salvarConfiguracaoUsuario,
  validarConfiguracao,
} from "../services/configuracoes.service.js";
import { HttpError } from "../utils/errors.js";
import { buscarCotacao } from "../services/cotacoes.service.js";

const router = Router();
const limiteReinicio = rateLimit(10, 15 * 60000, (req) => `reinicio:${req.userId}`);

router.get("/me/configuracoes", authMiddleware, async (req, res) => {
  res.json(await buscarConfiguracaoUsuario(req.userId!));
});

router.patch("/me/configuracoes", authMiddleware, async (req, res) => {
  const dados = validarConfiguracao(req.body);
  res.json(await salvarConfiguracaoUsuario(req.userId!, dados));
});

router.get("/me/cotacoes", authMiddleware, async (_req, res) => {
  res.json(await buscarCotacao());
});

router.delete("/me/dados-financeiros", authMiddleware, limiteReinicio, async (req, res) => {
  if (req.body?.confirmacao !== "RECOMEÇAR") {
    throw new HttpError(400, "Digite RECOMEÇAR para confirmar a exclusão dos dados financeiros.");
  }
  await excluirDadosFinanceiros(req.userId!);
  res.sendStatus(204);
});

export default router;
