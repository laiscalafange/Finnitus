
import { Router } from "express";
import { listarCategorias } from "../controllers/categoria.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listarCategorias);

export default router;
