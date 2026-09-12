import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

const routes = Router();

routes.use(healthRoutes);
routes.use(authRoutes);
routes.use(userRoutes);

export default routes;