import { Router } from "express";
import {
  criarMeta,
  listarMetas,
  buscarMeta,
  atualizarMeta,
  excluirMeta,
} from "../controllers/meta.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", criarMeta);
router.get("/", listarMetas);
router.get("/:id", buscarMeta);
router.put("/:id", atualizarMeta);
router.delete("/:id", excluirMeta);

export default router;