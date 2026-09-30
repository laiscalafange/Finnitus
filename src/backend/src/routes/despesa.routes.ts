import { Router } from "express";
import {
  criarDespesa,
  listarDespesas,
  buscarDespesa,
  atualizarDespesa,
  excluirDespesa,
} from "../controllers/despesa.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", criarDespesa);
router.get("/", listarDespesas);
router.get("/:id", buscarDespesa);
router.put("/:id", atualizarDespesa);
router.delete("/:id", excluirDespesa);

export default router;