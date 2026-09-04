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
  password: string,
): Promise<SafeUser> {
  const user = await prisma.usuario.findUnique({
    where: { Uemail: email },
  });

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const passwordMatches = await bcrypt.compare(password, user.Usenha);

  if (!passwordMatches) {
    throw new Error("Credenciais inválidas");
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
