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