import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import receitaRoutes from "./receita.routes.js";
import userRoutes from "./user.routes.js";
import eventosRoutes from "./eventos.routes.js";
import calendarioRoutes from "./calendario.routes.js";

const routes = Router();

routes.use(healthRoutes);
routes.use(authRoutes);
routes.use(userRoutes);

routes.use("/receitas", receitaRoutes);
routes.use("/eventos", eventosRoutes);
routes.use("/calendario", calendarioRoutes);

export default routes;