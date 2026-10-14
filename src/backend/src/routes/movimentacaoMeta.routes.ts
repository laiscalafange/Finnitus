import { Router } from "express";
import {
  criarMovimentacaoMeta,
  listarMovimentacoesMeta,
  buscarMovimentacaoMeta,
  atualizarMovimentacaoMeta,
  excluirMovimentacaoMeta,
} from "../controllers/movimentacaoMeta.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", criarMovimentacaoMeta);
router.get("/", listarMovimentacoesMeta);
router.get("/:id", buscarMovimentacaoMeta);
router.put("/:id", atualizarMovimentacaoMeta);
router.delete("/:id", excluirMovimentacaoMeta);

export default router;