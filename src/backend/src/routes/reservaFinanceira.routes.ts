import { Router } from "express";
import {
  criarReservaFinanceira,
  buscarReservaFinanceira,
  atualizarReservaFinanceira,
  excluirReservaFinanceira,
} from "../controllers/reservaFinanceira.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", criarReservaFinanceira);
router.get("/:id", buscarReservaFinanceira);
router.put("/:id", atualizarReservaFinanceira);
router.delete("/:id", excluirReservaFinanceira);

export default router;