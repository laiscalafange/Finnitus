import { Router } from "express";
import {
  criarDivida,
  listarDividas,
  buscarDivida,
  atualizarDivida,
  excluirDivida,
} from "../controllers/divida.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", criarDivida);
router.get("/", listarDividas);
router.get("/:id", buscarDivida);
router.put("/:id", atualizarDivida);
router.delete("/:id", excluirDivida);

export default router;