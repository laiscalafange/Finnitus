import { Router } from "express";

import {
  listarCalendario,
} from "../controllers/calendario.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listarCalendario);

export default router;