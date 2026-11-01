import { Router } from "express";

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

// Implementação oficial de Metas
import metasRoutes from "./metas.routes.js";

const routes = Router();

routes.use(healthRoutes);
routes.use(authRoutes);
// Compatibilidade com clientes que usam /auth/login e /auth/register.
routes.use("/auth", authRoutes);
routes.use(userRoutes);

routes.use("/receitas", receitaRoutes);
routes.use("/despesas", despesaRoutes);
routes.use("/eventos", eventosRoutes);
routes.use("/calendario", calendarioRoutes);

// Edita receitas e despesas exibidas nas Movimentações do dia.
routes.use("/calendario", calendarioMovimentacoesRoutes);

routes.use("/imprevistos", imprevistoRoutes);

// Metas: criação, consulta, histórico e movimentações
routes.use("/metas", metasRoutes);

routes.use("/dividas", dividaRoutes);
routes.use("/reserva", reservaFinanceiraRoutes);
routes.use("/categorias-personalizadas", categoriaPersonalizadaRoutes);
routes.use("/plano-b", planoBRoutes);

export default routes;