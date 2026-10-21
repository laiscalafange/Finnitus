import { Router } from "express";

import {
  getMe,
  updateMe,
  changePassword,
  deleteMe,
  logout,
} from "../controllers/user.controller.js";

import {
  getFotoPerfil,
  atualizarFotoPerfil,
  excluirFotoPerfil,
} from "../controllers/fotoPerfil.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  sensitiveLimiter,
} from "../middlewares/rateLimit.middleware.js";

import {
  uploadFotoPerfil,
} from "../middlewares/uploadFoto.middleware.js";

import {
  linkGoogle,
} from "../controllers/googleAuth.controller.js";

const router = Router();

// ===============================
// DADOS DO USUÁRIO
// ===============================

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

// ===============================
// FOTO DE PERFIL
// ===============================

router.get(
  "/me/foto",
  authMiddleware,
  getFotoPerfil,
);

router.patch(
  "/me/foto",
  authMiddleware,
  uploadFotoPerfil,
  atualizarFotoPerfil,
);

router.delete(
  "/me/foto",
  authMiddleware,
  excluirFotoPerfil,
);

// ===============================
// SENHA
// ===============================

router.patch(
  "/me/password",
  sensitiveLimiter,
  authMiddleware,
  changePassword,
);

// ===============================
// EXCLUSÃO DE CONTA
// ===============================

router.delete(
  "/me",
  sensitiveLimiter,
  authMiddleware,
  deleteMe,
);

// ===============================
// LOGOUT
// ===============================

router.post(
  "/logout",
  authMiddleware,
  logout,
);

// ===============================
// COMPATIBILIDADE
// ===============================

router.put(
  "/password",
  sensitiveLimiter,
  authMiddleware,
  changePassword,
);

// ===============================
// GOOGLE
// ===============================

router.post(
  "/me/google",
  sensitiveLimiter,
  authMiddleware,
  linkGoogle,
);

export default router;