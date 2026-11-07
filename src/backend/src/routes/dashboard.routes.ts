
// Cria o roteador do dashboard financeiro.
import { Router } from "express";

// Importa o controller que consulta os dados do dashboard.
import {
  buscarDadosDashboard,
} from "../controllers/gestaoFinanceira.controller.js";

// Importa o middleware de autenticação existente.
import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

// Cria o roteador do dashboard.
const router = Router();

// Protege todas as rotas deste arquivo.
router.use(authMiddleware);

// Retorna os dados financeiros do período solicitado.
router.get("/", buscarDadosDashboard);

// Exporta o roteador.
export default router;