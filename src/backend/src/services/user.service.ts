import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

interface SafeUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// função para criar um novo usuário no banco de dados
export async function createUser(
  input: CreateUserInput
): Promise<SafeUser> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error("E-mail já cadastrado");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: passwordHash,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

// função para validar as credenciais do usuário (email e senha) durante o login
export async function validateCredentials(
  email: string,
  password: string,
): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new Error("Credenciais inválidas");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}