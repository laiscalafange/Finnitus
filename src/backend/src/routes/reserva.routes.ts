
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  buscarReserva,
  criar,
  definirMeta,
  depositar,
  retirar,
  excluir,
} from "../controllers/reserva.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", buscarReserva);
router.post("/", criar);
router.patch("/meta", definirMeta);
router.post("/depositos", depositar);
router.post("/retiradas", retirar);
router.delete("/", excluir);

export default router;
