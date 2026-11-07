
import { Router } from "express";

import {
  salvarPerfil,
  salvarReserva,
  buscarPerfil,
} from "../controllers/perfilFinanceiro.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas as rotas exigem autenticação.
router.use(authMiddleware);

// Dados iniciais de renda e despesas.
router.put("/", salvarPerfil);

// Dados da reserva de emergência.
router.patch("/reserva", salvarReserva);

// Consulta do perfil financeiro.
router.get("/", buscarPerfil);

export default router;
