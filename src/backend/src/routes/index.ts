import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";

const routes = Router();

routes.use(healthRoutes);
routes.use(authRoutes);

export default routes;