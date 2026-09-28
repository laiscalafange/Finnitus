import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

export const safeSelect = {
  id_Usuario: true,
  Unome: true,
  Uemail: true,
  Utelefone: true,
  Udata_nasc: true,
  Udata_cadastro: true,
  UTipo: true,
} as const;

type PublicRow = {
  id_Usuario: number;
  Unome: string;
  Uemail: string;
  Utelefone: string | null;
  Udata_nasc: Date | null;
  Udata_cadastro: Date;
  UTipo: string;
};

export function safeUser(user: PublicRow) {
  return {
    id: user.id_Usuario,
    name: user.Unome,
    email: user.Uemail,
    telefone: user.Utelefone,
    data_nasc: user.Udata_nasc,
    data_cadastro: user.Udata_cadastro,
    tipo: user.UTipo,

    profileComplete: Boolean(
      user.Utelefone && user.Udata_nasc,
    ),
  };
}

export async function getUserById(id: number) {
  const user = await prisma.usuario.findUnique({
    where: {
      id_Usuario: id,
    },
    select: safeSelect,
  });

  if (!user) {
    throw new HttpError(401, "Usuário não encontrado.");
  }

  return safeUser(user);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const hash = await bcrypt.hash(input.password, 12);

  try {
    const user = await prisma.usuario.create({
      data: {
        Unome: input.name,
        Uemail: input.email,
        Usenha: hash,
        Udata_cadastro: new Date(),
        UTipo: "usuario",
      },
      select: safeSelect,
    });


    return safeUser(user);
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      throw new HttpError(409, "E-mail já cadastrado.");
    }

    throw error;
  }
}

// Evita pular completamente o bcrypt quando a conta não existe.
const dummyHash = bcrypt.hash("finnitus-dummy-password", 12);

export async function validateCredentials(
  email: string,
  password: string,
) {
  const user = await prisma.usuario.findUnique({
    where: {
      Uemail: email,
    },
  });

  const valid = await bcrypt.compare(
    password,
    user?.Usenha ?? (await dummyHash),
  );

  if (!user || !user.Usenha || !valid) {
    throw new HttpError(401, "Credenciais inválidas.");
  }

  return {
    user: safeUser(user),
    tokenVersion: user.tokenVersion,
  };
}
export async function updateUser(
  id: number,
  data: {
    Unome?: string;
    Utelefone?: string;
    Udata_nasc?: Date;
  },
) {
  const user = await prisma.usuario.update({
    where: {
      id_Usuario: id,
    },
    data,
    select: safeSelect,
  });

  return safeUser(user);
}

export async function changeUserPassword(
  id: number,
  current: string,
  next: string,
) {
  const user = await prisma.usuario.findUnique({
    where: {
      id_Usuario: id,
    },
  });

  if (user && !user.Usenha) {
  throw new HttpError(
    400,
    "Sua conta ainda não possui senha do Finnitus. Use a recuperação de senha para definir uma.",
  );
}

  if (
  !user ||
  !user.Usenha ||
  !(await bcrypt.compare(current, user.Usenha))
) {
  throw new HttpError(400, "Senha atual incorreta.");
}

  const hash = await bcrypt.hash(next, 12);

  await prisma.$transaction(async (tx) => {
    const changed = await tx.usuario.updateMany({
      where: {
        id_Usuario: id,
        Usenha: user.Usenha,
      },
      data: {
        Usenha: hash,
        tokenVersion: {
          increment: 1,
        },
      },
    });

    if (changed.count !== 1) {
      throw new HttpError(
        409,
        "Senha alterada em outra sessão. Faça login novamente.",
      );
    }

    await tx.redefinicaoSenha.updateMany({
      where: {
        id_Usuario: id,
        usado: false,
      },
      data: {
        usado: true,
      },
    });
  });
}

export async function deleteUser(
  id: number,
  password: string,
) {
  const user = await prisma.usuario.findUnique({
    where: {
      id_Usuario: id,
    },
  });

  // Conta Google que ainda não definiu uma senha local.
  if (user && !user.Usenha) {
    throw new HttpError(
      400,
      "Para excluir por este fluxo, primeiro defina uma senha do Finnitus usando a recuperação de senha.",
    );
  }

  // Verifica se o usuário existe e se a senha está correta.
  if (
    !user ||
    !user.Usenha ||
    !(await bcrypt.compare(password, user.Usenha))
  ) {
    throw new HttpError(400, "Senha atual incorreta.");
  }


  await prisma.$transaction(async (tx) => {
    // Confere a senha novamente na condição da atualização
    // e bloqueia a linha durante a transação.
    const lock = await tx.usuario.updateMany({
      where: {
        id_Usuario: id,
        Usenha: user.Usenha,
      },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });

    if (lock.count !== 1) {
      throw new HttpError(
        409,
        "Conta alterada. Faça login novamente.",
      );
    }

    const where = {
      id_Usuario: id,
    };

    await tx.redefinicaoSenha.deleteMany({ where });

// Receitas e despesas precisam ser removidas antes das categorias.
await tx.receita.deleteMany({ where });
await tx.despesa.deleteMany({ where });

await tx.meta.deleteMany({ where });
await tx.imprevisto.deleteMany({ where });
await tx.evento.deleteMany({ where });

await tx.categoriaPersonalizada.deleteMany({ where });

// O usuário é removido por último.
await tx.usuario.delete({ where });
  });
}

export async function logoutUser(id: number) {
  await prisma.usuario.update({
    where: {
      id_Usuario: id,
    },
    data: {
      tokenVersion: {
        increment: 1,
      },
    },
  });
}