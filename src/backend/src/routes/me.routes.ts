import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { changePassword } from "../controllers/me.controller.js";
import { updateMe } from "../controllers/user.controller.js";

const router = Router();

router.patch(
  "/password",
  authMiddleware,
  changePassword,
  updateMe,
);

export default router;