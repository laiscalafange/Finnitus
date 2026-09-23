import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import receitaRoutes from "./receita.routes.js";
import categoriaRoutes from "./categoria.routes.js";
import userRoutes from "./user.routes.js";

const routes = Router();

routes.use(healthRoutes);
routes.use(authRoutes);
routes.use(userRoutes);

routes.use("/receitas", receitaRoutes);
routes.use("/categorias", categoriaRoutes);

export default routes;