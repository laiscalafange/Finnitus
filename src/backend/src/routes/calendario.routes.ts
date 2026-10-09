import { Router } from "express";

import {
  listarCalendario,
} from "../controllers/calendario.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

import {
  confirmarEvento,
} from "../controllers/calendarioConfirmacao.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listarCalendario);

router.post(
  "/confirmar-evento",
  confirmarEvento
);

export default router;