import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../lib/prisma.js";

export async function changePassword(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        error: "Não autorizado.",
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        error: "Informe a senha atual e a nova senha.",
      });
      return;
    }

    if (typeof currentPassword !== "string") {
      res.status(400).json({
        error: "Senha atual inválida.",
      });
      return;
    }

    if (typeof newPassword !== "string") {
      res.status(400).json({
        error: "Nova senha inválida.",
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        error: "A nova senha deve possuir pelo menos 8 caracteres.",
      });
      return;
    }

    if (currentPassword === newPassword) {
      res.status(400).json({
        error: "A nova senha deve ser diferente da senha atual.",
      });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id_Usuario: userId,
      },
    });

    if (!usuario) {
      res.status(404).json({
        error: "Usuário não encontrado.",
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      usuario.Usenha,
    );

    if (!passwordMatches) {
      res.status(400).json({
        error: "Senha atual incorreta.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12,
    );

    await prisma.usuario.update({
      where: {
        id_Usuario: userId,
      },

      data: {
        Usenha: hashedPassword,
      },
    });

    res.status(200).json({
      message: "Senha alterada com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);

    res.status(500).json({
      error: "Erro interno ao alterar senha.",
    });
  }
}