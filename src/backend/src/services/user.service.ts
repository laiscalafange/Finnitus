import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";



interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  telefone: string;
  data_nasc: Date;
}

interface SafeUser {
  id: number;
  name: string;
  email: string;
  telefone: string;
  data_nasc: Date;
  data_cadastro: Date;
  tipo: string;
}

interface UpdateUserInput {
  name?: string;
  telefone?: string;
  data_nasc?: Date;
}

export async function updateUser(
  userId: number,
  input: UpdateUserInput,
) {
  const existingUser =
    await prisma.usuario.findUnique({
      where: {
        id_Usuario: userId,
      },
    });

  if (!existingUser) {
    throw new Error("Usuário não encontrado");
  }

  const user = await prisma.usuario.update({
    where: {
      id_Usuario: userId,
    },

    data: {
      ...(input.name !== undefined && {
        Unome: input.name,
      }),

      ...(input.telefone !== undefined && {
        Utelefone: input.telefone,
      }),

      ...(input.data_nasc !== undefined && {
        Udata_nasc: input.data_nasc,
      }),
    },

    select: {
      id_Usuario: true,
      Unome: true,
      Uemail: true,
      Utelefone: true,
      Udata_nasc: true,
      Udata_cadastro: true,
      UTipo: true,
    },
  });

  return {
    id: user.id_Usuario,
    name: user.Unome,
    email: user.Uemail,
    telefone: user.Utelefone,
    data_nasc: user.Udata_nasc,
    data_cadastro: user.Udata_cadastro,
    tipo: user.UTipo,
  };
}

/* 
export function generateToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

interface ResetTokenPayload {
  sub: string;
  purpose: "reset-password";
  redefinicaoId: number;
}

export function generateResetToken(userId: number, redefinicaoId: number): string {
  return jwt.sign(
    { sub: String(userId), purpose: "reset-password", redefinicaoId },
    env.JWT_SECRET,
    { expiresIn: "10m" },
  );
}

export function verifyResetToken(token: string): { userId: number; redefinicaoId: number } {
  const payload = jwt.verify(token, env.JWT_SECRET) as ResetTokenPayload;

  if (payload.purpose !== "reset-password") {
    throw new Error("Token inválido");
  }

  return { userId: Number(payload.sub), redefinicaoId: payload.redefinicaoId };
}
  */

// Função para criar um novo usuário no banco de dados
export async function getUserById(userId: number) {
  const user = await prisma.usuario.findUnique({
    where: {
      id_Usuario: userId,
    },

    select: {
      id_Usuario: true,
      Unome: true,
      Uemail: true,
      Utelefone: true,
      Udata_nasc: true,
      Udata_cadastro: true,
      UTipo: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return {
    id: user.id_Usuario,
    name: user.Unome,
    email: user.Uemail,
    telefone: user.Utelefone,
    data_nasc: user.Udata_nasc,
    data_cadastro: user.Udata_cadastro,
    tipo: user.UTipo,
  };
}


export async function createUser(
  input: CreateUserInput
): Promise<SafeUser> {
  const existingUser = await prisma.usuario.findUnique({
    where: { Uemail: input.email },
  });

  if (existingUser) {
    throw new Error("E-mail já cadastrado");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.usuario.create({
    data: {
      Unome: input.name,
      Usenha: passwordHash,
      Uemail: input.email,
      Utelefone: input.telefone,
      Udata_nasc: input.data_nasc,
      Udata_cadastro: new Date(),
      UTipo: "usuario",
    },
  });

  return {
    id: user.id_Usuario,
    name: user.Unome,
    email: user.Uemail,
    telefone: user.Utelefone,
    data_nasc: user.Udata_nasc,
    data_cadastro: user.Udata_cadastro,
    tipo: user.UTipo,
  };
}

// Função para validar as credenciais do usuário durante o login
export async function validateCredentials(
  email: string,
  password: string
) {
  const user = await prisma.usuario.findUnique({
    where: {
      Uemail: email,
    },
  });

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const bcrypt = await import("bcrypt");

  const senhaCorreta = await bcrypt.compare(
    password,
    user.Usenha
  );

  if (!senhaCorreta) {
    throw new Error("Credenciais inválidas");
  }

  return {
    id: user.id_Usuario,
    name: user.Unome,
    email: user.Uemail,
    telefone: user.Utelefone,
    data_nasc: user.Udata_nasc,
    tipo: user.UTipo,
  };
}
export async function changeUserPassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await prisma.usuario.findUnique({
    where: {
      id_Usuario: userId,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.Usenha,
  );

  if (!passwordMatches) {
    throw new Error("Senha atual incorreta");
  }

  const samePassword = await bcrypt.compare(
    newPassword,
    user.Usenha,
  );

  if (samePassword) {
    throw new Error(
      "A nova senha deve ser diferente da senha atual",
    );
  }

  const passwordHash = await bcrypt.hash(
    newPassword,
    10,
  );

  await prisma.usuario.update({
    where: {
      id_Usuario: userId,
    },

    data: {
      Usenha: passwordHash,
    },
  });
}