import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import receitaRoutes from "./receita.routes.js";


const routes = Router();

routes.use(healthRoutes);
routes.use(authRoutes);
routes.use("/receitas", receitaRoutes);

export default routes;
