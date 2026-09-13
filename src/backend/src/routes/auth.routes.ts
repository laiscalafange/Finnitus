import { Router } from "express";

import {
  register,
  login,
  resetPassword,
  verifyCode,
  forgotPassword,
} from "../controllers/auth.controller.js";

import {
  loginLimiter,
  recoveryLimiter,
  sensitiveLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", recoveryLimiter, register);
router.post("/login", loginLimiter, login);

router.post(
  "/forgot-password",
  recoveryLimiter,
  forgotPassword,
);

router.post("/verify-code", sensitiveLimiter, verifyCode);

router.post(
  "/reset-password",
  sensitiveLimiter,
  resetPassword,
);

export default router;