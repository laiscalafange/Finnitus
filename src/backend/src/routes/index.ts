import { Router } from "express";

// Importa as rotas existentes da aplicação.
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import receitaRoutes from "./receita.routes.js";
import despesaRoutes from "./despesa.routes.js";
import userRoutes from "./user.routes.js";
import eventosRoutes from "./eventos.routes.js";
import calendarioRoutes from "./calendario.routes.js";
import calendarioMovimentacoesRoutes from "./calendarioMovimentacoes.routes.js";
import imprevistoRoutes from "./imprevisto.routes.js";
import dividaRoutes from "./divida.routes.js";
import reservaFinanceiraRoutes from "./reserva.routes.js";
import categoriaPersonalizadaRoutes from "./categoriaPersonalizada.routes.js";
import planoBRoutes from "./planoB.routes.js";
import metasRoutes from "./metas.routes.js";
import perfilFinanceiroRoutes from "./perfilFinanceiro.routes.js";
import { criarRotasNotificacoes } from "./notificacoes.routes.js";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// Importa as novas rotas financeiras.
import telaInicialRoutes from "./telaInicial.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

// Cria o roteador principal da API.
const routes = Router();

// Rotas gerais e autenticação.
routes.use(healthRoutes);
routes.use(authRoutes);
// Compatibilidade com clientes que usam /auth/login e /auth/register.
routes.use("/auth", authRoutes);
routes.use(userRoutes);

// Rotas de receitas e funcionalidades relacionadas.
routes.use("/receitas", receitaRoutes);
routes.use("/despesas", despesaRoutes);
routes.use("/eventos", eventosRoutes);
routes.use("/notificacoes", criarRotasNotificacoes({ prisma, autenticar: authMiddleware }));
routes.use("/calendario", calendarioRoutes);

// Edita receitas e despesas exibidas nas Movimentações do dia.
routes.use("/calendario", calendarioMovimentacoesRoutes);

routes.use("/imprevistos", imprevistoRoutes);

// Rotas de metas, histórico e movimentações.
routes.use("/metas", metasRoutes);

// Rotas de dívidas e reserva financeira.
routes.use("/dividas", dividaRoutes);
routes.use("/reserva", reservaFinanceiraRoutes);

// Rotas de categorias personalizadas.
routes.use(
  "/categorias-personalizadas",
  categoriaPersonalizadaRoutes,
);

// Rotas do Plano B.
routes.use("/plano-b", planoBRoutes);

// Rotas da tela inicial e do dashboard financeiro.
routes.use("/tela-inicial", telaInicialRoutes);
routes.use("/dashboard", dashboardRoutes);
routes.use("/perfil-financeiro", perfilFinanceiroRoutes);

// Exporta todas as rotas para o app.ts.
export default routes;
