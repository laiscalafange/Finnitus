import { Router } from "express";
import { checkHealth } from "../controllers/health.controller.js";

const healthRoutes = Router();

healthRoutes.get("/health", checkHealth);

export default healthRoutes;