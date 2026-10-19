import { Router } from "express";
import { analisarPlanoBController } from "../controllers/planoB.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", analisarPlanoBController);

export default router;