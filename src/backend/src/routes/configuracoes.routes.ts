import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sensitiveLimiter } from "../middlewares/rateLimit.middleware.js";
import {
  buscarConfiguracaoUsuario,
  excluirDadosFinanceiros,
  salvarConfiguracaoUsuario,
  validarConfiguracao,
} from "../services/configuracoes.service.js";
import { HttpError } from "../utils/errors.js";

const router = Router();

router.get("/me/configuracoes", authMiddleware, async (req, res) => {
  res.json(await buscarConfiguracaoUsuario(req.userId!));
});

router.patch("/me/configuracoes", authMiddleware, async (req, res) => {
  const dados = validarConfiguracao(req.body);
  res.json(await salvarConfiguracaoUsuario(req.userId!, dados));
});

router.delete("/me/dados-financeiros", sensitiveLimiter, authMiddleware, async (req, res) => {
  if (req.body?.confirmacao !== "RECOMEÇAR") {
    throw new HttpError(400, "Digite RECOMEÇAR para confirmar a exclusão dos dados financeiros.");
  }
  await excluirDadosFinanceiros(req.userId!);
  res.sendStatus(204);
});

export default router;
