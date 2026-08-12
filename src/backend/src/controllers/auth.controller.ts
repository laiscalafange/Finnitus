import type { Request, Response } from "express";
import { createUser } from "../services/user.service.js";

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