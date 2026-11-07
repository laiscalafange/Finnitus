import { Router } from "express";

import {
  criarMeta,
  listarMetas,
  buscarMeta,
  atualizarMeta,
  adicionarAporte,
  retirarDaMeta,
  cancelarMeta,
  reabrirMeta,
  listarHistorico,
  obterAnalises,
} from "../controllers/metas.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", criarMeta);

router.get("/", listarMetas);

router.get(
  "/analises",
  obterAnalises,
);

router.get(
  "/historico",
  listarHistorico,
);

router.get(
  "/:id",
  buscarMeta,
);

router.put(
  "/:id",
  atualizarMeta,
);

router.post(
  "/:id/aportes",
  adicionarAporte,
);

router.post(
  "/:id/retiradas",
  retirarDaMeta,
);

router.patch(
  "/:id/cancelar",
  cancelarMeta,
);

router.patch(
  "/:id/reabrir",
  reabrirMeta,
);

export default router;