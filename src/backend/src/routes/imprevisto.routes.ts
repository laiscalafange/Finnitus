import { Router } from "express";
import {
  criarImprevisto,
  listarImprevistos,
  buscarImprevisto,
  atualizarImprevisto,
  excluirImprevisto,
} from "../controllers/imprevisto.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", criarImprevisto);
router.get("/", listarImprevistos);
router.get("/:id", buscarImprevisto);
router.put("/:id", atualizarImprevisto);
router.delete("/:id", excluirImprevisto);

export default router;