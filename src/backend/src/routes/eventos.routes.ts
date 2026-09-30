import { Router } from "express";

import {
  criarEvento,
  listarEventos,
  buscarEvento,
  atualizarEvento,
  excluirEvento,
} from "../controllers/eventos.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", criarEvento);
router.get("/", listarEventos);
router.get("/:id", buscarEvento);
router.put("/:id", atualizarEvento);
router.delete("/:id", excluirEvento);

export default router;