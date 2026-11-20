import { Router } from "express";

import { enviarContato } from "../controllers/contato.controller.js";
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
  rateLimit,
  sensitiveLimiter,
} from "../middlewares/rateLimit.middleware.js";

import {
  uploadFotoPerfil,
} from "../middlewares/uploadFoto.middleware.js";

import {
  linkGoogle,
} from "../controllers/googleAuth.controller.js";
import {
  ativar2FA,
  confirmar2FA,
  desativar2FA,
  desconectarSessao,
  verConfiguracao2FA,
  verSessoes,
} from "../controllers/seguranca.controller.js";

const router = Router();
const contatoLimiter = rateLimit(5, 60 * 60000, (req) => `contato:${req.userId}`);

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

router.post("/me/contato", authMiddleware, contatoLimiter, enviarContato);

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

router.get("/me/sessoes", authMiddleware, verSessoes);
router.delete("/me/sessoes/:id", authMiddleware, desconectarSessao);

router.get("/me/2fa", authMiddleware, verConfiguracao2FA);
router.post("/me/2fa/ativar", sensitiveLimiter, authMiddleware, ativar2FA);
router.post("/me/2fa/confirmar", sensitiveLimiter, authMiddleware, confirmar2FA);
router.post("/me/2fa/desativar", sensitiveLimiter, authMiddleware, desativar2FA);

export default router;
