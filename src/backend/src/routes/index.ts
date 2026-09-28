import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import receitaRoutes from "./receita.routes.js";
import despesaRoutes from "./despesa.routes.js";
import eventoRoutes from "./eventos.routes.js";
import userRoutes from "./user.routes.js";

const routes = Router();

routes.use(healthRoutes);
routes.use(authRoutes);
routes.use(userRoutes);

routes.use("/receitas", receitaRoutes);
routes.use("/despesas", despesaRoutes);
routes.use("/eventos", eventoRoutes);

export default routes;