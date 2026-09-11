import type { Request, Response } from "express";
import { createUser, validateCredentials } from "../services/user.service.js";
import { generateToken } from "../services/token.service.js";
import {
  requestPasswordReset,
  verifyResetCode,
  resetPassword as resetPasswordService,
} from "../services/passwordReset.service.js";
import { verifyResetToken } from "../services/token.service.js";

export async function forgotPassword(
  req: Request,
  res: Response
): Promise<void> {
  const { email } = req.body as { email?: string };

  if (!email) {
    res.status(400).json({
      error: "email é obrigatório",
    });
    return;
  }

  try {
    await requestPasswordReset(email);

    res.status(200).json({
      message:
        "Se o e-mail existir, um código de redefinição foi enviado.",
    });
  } catch (err) {
    console.error("Erro ao solicitar recuperação de senha:", err);

    res.status(500).json({
      error: "Erro ao enviar código de recuperação",
    });
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { resetToken, newPassword } = req.body as { resetToken?: string; newPassword?: string };
  if (!resetToken || !newPassword) {
    res.status(400).json({ error: "resetToken e newPassword são obrigatórios" });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: "A senha precisa ter no mínimo 8 caracteres" });
    return;
  }

  try {
    const { userId } = verifyResetToken(resetToken);
    await resetPasswordService(userId, newPassword);
    res.status(200).json({ message: "Senha redefinida com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Token inválido ou expirado" });
  }
}

// Função para lidar com o login do usuário
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({
      error: "email e password são obrigatórios",
    });
    return;
  }

  try {
    const user = await validateCredentials(email, password);
    const token = generateToken(user.id);

    res.status(200).json({
      user,
      token,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Credenciais inválidas") {
      res.status(401).json({
        error: err.message,
      });
      return;
    }

    console.error(err);

    res.status(500).json({
      error: "Erro ao fazer login",
    });
  }
}

// Função para lidar com o registro de um novo usuário
export async function register(req: Request, res: Response): Promise<void> {
  const {
    name,
    email,
    password,
    telefone,
    data_nasc,
  } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    telefone?: string;
    data_nasc?: string;
  };

  if (!name || !email || !password || !telefone || !data_nasc) {
    res.status(400).json({
      error:
        "name, email, password, telefone e data_nasc são obrigatórios",
    });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      error: "A senha precisa ter no mínimo 8 caracteres",
    });
    return;
  }

  const dataNascimento = new Date(data_nasc);

  if (isNaN(dataNascimento.getTime())) {
    res.status(400).json({
      error: "data_nasc inválida",
    });
    return;
  }

  try {
    const user = await createUser({
      name,
      email,
      password,
      telefone,
      data_nasc: dataNascimento,
    });

    res.status(201).json({
      user,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "E-mail já cadastrado") {
      res.status(409).json({
        error: err.message,
      });
      return;
    }

    console.error(err);

    res.status(500).json({
      error: "Erro ao cadastrar usuário",
    });
  }
}
