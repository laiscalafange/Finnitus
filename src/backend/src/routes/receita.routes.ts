import { Router } from "express";

import {
  criarReceita,
  listarReceitas,
  buscarReceita,
  atualizarReceita,
  excluirReceita,
} from "../controllers/receita.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", criarReceita);
router.get("/", listarReceitas);
router.get("/:id", buscarReceita);
router.put("/:id", atualizarReceita);
router.delete("/:id", excluirReceita);

export default router; 