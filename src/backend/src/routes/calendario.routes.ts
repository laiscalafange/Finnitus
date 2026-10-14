import { Router } from "express";

import {
  listarCalendario,
} from "../controllers/calendario.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

import {
  confirmarEvento,
  marcarNaoFinanceiro,
} from "../controllers/calendarioConfirmacao.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listarCalendario);

router.post(
  "/confirmar-evento",
  confirmarEvento
);

router.post(
  "/nao-financeiro",
  marcarNaoFinanceiro
);

export default router;