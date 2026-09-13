import { Router } from "express";

import {
  getMe,
  updateMe,
  changePassword,
  deleteMe,
  logout,
} from "../controllers/user.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  sensitiveLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  getMe,
);

router.patch(
  "/me",
  authMiddleware,
  updateMe,
);

router.patch(
  "/me/password",
  sensitiveLimiter,
  authMiddleware,
  changePassword,
);

router.delete(
  "/me",
  sensitiveLimiter,
  authMiddleware,
  deleteMe,
);

router.post(
  "/logout",
  authMiddleware,
  logout,
);

// Compatibilidade com o caminho antigo.
router.put(
  "/password",
  sensitiveLimiter,
  authMiddleware,
  changePassword,
);

export default router;