import type {
  Request,
  Response,
} from "express";

import {
  getUserById,
  changeUserPassword,
  updateUser,
} from "../services/user.service.js";

export async function getMe(
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

    const user = await getUserById(Number(userId));

    res.status(200).json({
      user,
    });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === "Usuário não encontrado"
    ) {
      res.status(404).json({
        error: err.message,
      });
      return;
    }

    console.error(err);

    res.status(500).json({
      error: "Erro ao buscar usuário.",
    });
  }
}

export async function updateMe(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      error: "Não autorizado.",
    });
    return;
  }

  const {
    name,
    telefone,
    data_nasc,
  } = req.body as {
    name?: string;
    telefone?: string;
    data_nasc?: string;
  };

  if (
    name === undefined &&
    telefone === undefined &&
    data_nasc === undefined
  ) {
    res.status(400).json({
      error: "Nenhum dado foi informado.",
    });
    return;
  }

  if (
    name !== undefined &&
    name.trim().length < 2
  ) {
    res.status(400).json({
      error: "Nome inválido.",
    });
    return;
  }

  let birthDate: Date | undefined;

  if (data_nasc !== undefined) {
    birthDate = new Date(data_nasc);

    if (Number.isNaN(birthDate.getTime())) {
      res.status(400).json({
        error: "Data de nascimento inválida.",
      });
      return;
    }
  }

  try {
    const user = await updateUser(
      userId,
      {
        name: name?.trim(),
        telefone,
        data_nasc: birthDate,
      },
    );

    res.status(200).json({
      message: "Dados atualizados com sucesso.",
      user,
    });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === "Usuário não encontrado"
    ) {
      res.status(404).json({
        error: err.message,
      });
      return;
    }

    console.error(err);

    res.status(500).json({
      error: "Erro ao atualizar usuário.",
    });
  }
}

export async function changePassword(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      error: "Não autorizado.",
    });
    return;
  }

  const {
    currentPassword,
    newPassword,
  } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    res.status(400).json({
      error:
        "currentPassword e newPassword são obrigatórios.",
    });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({
      error:
        "A nova senha precisa ter no mínimo 8 caracteres.",
    });
    return;
  }

  try {
    await changeUserPassword(
      Number(userId),
      currentPassword,
      newPassword,
    );

    res.status(200).json({
      message: "Senha alterada com sucesso.",
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Senha atual incorreta") {
        res.status(400).json({
          error: err.message,
        });
        return;
      }

      if (
        err.message ===
        "A nova senha deve ser diferente da senha atual"
      ) {
        res.status(400).json({
          error: err.message,
        });
        return;
      }

      if (err.message === "Usuário não encontrado") {
        res.status(404).json({
          error: err.message,
        });
        return;
      }
    }

    console.error(err);

    res.status(500).json({
      error: "Erro ao alterar senha.",
    });
  }
}