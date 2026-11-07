// Cria o roteador para a tela inicial.
import { Router } from "express";

// Importa o controller responsável pelo resumo financeiro.
import {
  buscarResumoTelaInicial,
} from "../controllers/gestaoFinanceira.controller.js";

// Importa o middleware de autenticação já existente.
import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

// Cria o roteador desta funcionalidade.
const router = Router();

// Exige autenticação em todas as rotas deste arquivo.
router.use(authMiddleware);

// Retorna o resumo financeiro do usuário autenticado.
router.get("/", buscarResumoTelaInicial);

// Exporta as rotas para o roteador principal.
export default router;
