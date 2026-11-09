
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
  registrarMetasIniciais,
} from "../controllers/metas.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas as rotas exigem autenticação.
router.use(authMiddleware);

// Criação e listagem de metas.
router.post("/", criarMeta);
router.get("/", listarMetas);

// Registra os objetivos selecionados no onboarding.
router.post("/iniciais", registrarMetasIniciais);

// Análises e histórico.
router.get("/analises", obterAnalises);
router.get("/historico", listarHistorico);

// Busca e atualização de uma meta específica.
router.get("/:id", buscarMeta);
router.put("/:id", atualizarMeta);

// Movimentações financeiras da meta.
router.post("/:id/aportes", adicionarAporte);
router.post("/:id/retiradas", retirarDaMeta);

// Gerenciamento do status da meta.
router.patch("/:id/cancelar", cancelarMeta);
router.patch("/:id/reabrir", reabrirMeta);

export default router;
