import { Router } from "express";
import { analisarPlanoBController } from "../controllers/planoB.controller.js";

const router = Router();

router.post("/", analisarPlanoBController);

export default router;