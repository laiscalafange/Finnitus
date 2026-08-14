import type { Request, Response } from "express";
import { createUser, validateCredentials } from "../services/user.service.js";
import { generateToken } from "../services/token.service.js";

// Função para lidar com o login do usuário
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "email e password são obrigatórios" });
    return;
  }

  try {
    const user = await validateCredentials(email, password);
    const token = generateToken(user.id);
    res.status(200).json({ user, token });
  } catch (err) {
    if (err instanceof Error && err.message === "Credenciais inválidas") {
      res.status(401).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
}

// Função para lidar com o registro de um novo usuário
export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ error: "name, email e password são obrigatórios" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "A senha precisa ter no mínimo 6 caracteres" });
    return;
  }

  try {
    const user = await createUser({ name, email, password });
    res.status(201).json({ user });
  } catch (err) {
    if (err instanceof Error && err.message === "E-mail já cadastrado") {
      res.status(409).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
}