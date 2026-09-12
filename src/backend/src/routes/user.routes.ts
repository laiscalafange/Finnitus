import { Router } from "express";

import {
  getMe,
  changePassword,
} from "../controllers/user.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  getMe,
);

router.put(
  "/password",
  authMiddleware,
  changePassword
);

export default router;