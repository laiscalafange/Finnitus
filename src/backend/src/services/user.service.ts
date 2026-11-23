import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { cloudinary } from "../config/cloudinary.js";
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
    where: { id_Usuario: id },
  });

  if (!user) {
    throw new HttpError(401, "Usuário não encontrado.");
  }

  if (!user.Usenha) {
    throw new HttpError(
      400,
      "Sua conta não possui senha local. Defina uma senha pela recuperação de senha antes de excluir a conta.",
    );
  }

  const senhaCorreta = await bcrypt.compare(
    password,
    user.Usenha,
  );

  if (!senhaCorreta) {
    throw new HttpError(400, "Senha atual incorreta.");
  }

  const usuarioExcluido = await prisma.$transaction(async (tx) => {
    // Protege contra alterações concorrentes na conta.
    const bloqueio = await tx.usuario.updateMany({
      where: {
        id_Usuario: id,
        Usenha: user.Usenha,
      },
      data: {
        tokenVersion: { increment: 1 },
      },
    });

    if (bloqueio.count !== 1) {
      throw new HttpError(
        409,
        "Conta alterada em outra sessão. Faça login novamente.",
      );
    }

    const where = { id_Usuario: id };

    // 1. Excluir eventos antes das receitas e despesas.
    await tx.evento.deleteMany({ where });

    // 2. Excluir dívidas vinculadas às categorias.
    await tx.divida.deleteMany({ where });

    // 3. Excluir registros financeiros.
    await tx.receita.deleteMany({ where });
    await tx.despesa.deleteMany({ where });

    // 4. Excluir metas.
    // MovimentacaoMeta possui onDelete: Cascade.
    await tx.meta.deleteMany({ where });

    // 5. Excluir imprevistos.
    await tx.imprevisto.deleteMany({ where });

    // 6. Excluir a reserva.
    // MovimentacaoReserva possui onDelete: Cascade.
    await tx.reservaFinanceira.deleteMany({ where });

    // 7. Excluir categorias criadas pelo usuário.
    await tx.categoriaPersonalizada.deleteMany({ where });

    // 8. Excluir tokens de recuperação de senha.
    await tx.redefinicaoSenha.deleteMany({ where });

    // 9. Excluir a conta por último.
    return tx.usuario.delete({
      where: { id_Usuario: id },
      select: { fotoPerfilPublicId: true },
    });
  });

  // Remover a foto armazenada no Cloudinary.
  // A conta já foi excluída do banco neste momento.
  if (usuarioExcluido.fotoPerfilPublicId) {
    try {
      await cloudinary.uploader.destroy(
        usuarioExcluido.fotoPerfilPublicId,
        { invalidate: true },
      );
    } catch (error) {
      console.error(
        "Conta excluída, mas houve falha ao remover a foto do Cloudinary:",
        error,
      );
    }
  }
}
