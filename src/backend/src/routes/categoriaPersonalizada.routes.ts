import { Router } from "express";
import {
  criarCategoriaPersonalizada,
  listarCategoriasPersonalizadas,
  buscarCategoriaPersonalizada,
  atualizarCategoriaPersonalizada,
  excluirCategoriaPersonalizada,
} from "../controllers/categoriaPersonalizada.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", criarCategoriaPersonalizada);
router.get("/", listarCategoriasPersonalizadas);
router.get("/:id", buscarCategoriaPersonalizada);
router.put("/:id", atualizarCategoriaPersonalizada);
router.delete("/:id", excluirCategoriaPersonalizada);

export default router;