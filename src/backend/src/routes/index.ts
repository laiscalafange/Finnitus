import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import receitaRoutes from "./receita.routes.js";
import userRoutes from "./user.routes.js";
import eventosRoutes from "./eventos.routes.js";
import calendarioRoutes from "./calendario.routes.js";
import imprevistoRoutes from "./imprevisto.routes.js";
import metaRoutes from "./meta.routes.js";
import movimentacaoMetaRoutes from "./movimentacaoMeta.routes.js";
import dividaRoutes from "./divida.routes.js";
import reservaFinanceiraRoutes from "./reservaFinanceira.routes.js";
import categoriaPersonalizadaRoutes from "./categoriaPersonalizada.routes.js";
import planoBRoutes from "./planoB.routes.js";
import metasRoutes from "./metas.routes.js";

const routes = Router();

routes.use(healthRoutes);
routes.use(authRoutes);
routes.use(userRoutes);

routes.use("/receitas", receitaRoutes);
routes.use("/eventos", eventosRoutes);
routes.use("/calendario", calendarioRoutes);
routes.use("/imprevistos", imprevistoRoutes);
routes.use("/metas", metaRoutes);
routes.use("/movimentacoes-meta", movimentacaoMetaRoutes);
routes.use("/dividas", dividaRoutes);
routes.use("/reserva-financeira", reservaFinanceiraRoutes);
routes.use("/categorias-personalizadas", categoriaPersonalizadaRoutes);
routes.use("/plano-b", planoBRoutes);
routes.use("/metas", metasRoutes);

export default routes;