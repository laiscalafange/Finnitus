import sharp from "sharp";

import { prisma } from "../lib/prisma.js";
import { cloudinary } from "../config/cloudinary.js";
import { HttpError } from "../utils/errors.js";

type FotoEnviada = {
  url: string;
  publicId: string;
};

// Enviar imagem ao Cloudinary
async function enviarImagem(
  arquivo: Buffer,
): Promise<FotoEnviada> {
  let imagem: Buffer;

  try {
    imagem = await sharp(arquivo, {
      limitInputPixels: 20_000_000,
    })
      .rotate()
      .resize(512, 512, {
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    throw new HttpError(
      400,
      "A imagem enviada é inválida ou não suportada.",
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "finnitus/fotos-perfil",
        resource_type: "image",
      },
      (erro, resultado) => {
        if (erro || !resultado) {
          reject(
            new HttpError(
              502,
              "Não foi possível armazenar a foto.",
            ),
          );
          return;
        }

        resolve({
          url: resultado.secure_url,
          publicId: resultado.public_id,
        });
      },
    );

    stream.on("error", () => {
      reject(
        new HttpError(
          502,
          "Falha no envio da imagem.",
        ),
      );
    });

    stream.end(imagem);
  });
}

// Consultar foto existente
export async function buscarFotoPerfil(
  idUsuario: number,
) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id_Usuario: idUsuario,
    },
    select: {
      fotoPerfilUrl: true,
    },
  });

  if (!usuario) {
    throw new HttpError(404, "Usuário não encontrado.");
  }

  return usuario.fotoPerfilUrl;
}

// Adicionar ou atualizar foto
export async function salvarFotoPerfil(
  idUsuario: number,
  arquivo: Buffer,
) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id_Usuario: idUsuario,
    },
    select: {
      fotoPerfilPublicId: true,
    },
  });

  if (!usuario) {
    throw new HttpError(404, "Usuário não encontrado.");
  }

  const fotoAntiga = usuario.fotoPerfilPublicId;

  const fotoNova = await enviarImagem(arquivo);

  let fotoPerfilUrl: string | null;

  try {
    const atualizado = await prisma.usuario.update({
      where: {
        id_Usuario: idUsuario,
      },
      data: {
        fotoPerfilUrl: fotoNova.url,
        fotoPerfilPublicId: fotoNova.publicId,
      },
      select: {
        fotoPerfilUrl: true,
      },
    });

    fotoPerfilUrl = atualizado.fotoPerfilUrl;
  } catch (erro) {
    // Evita deixar a imagem recém-enviada sem uso
    await cloudinary.uploader
      .destroy(fotoNova.publicId)
      .catch((erroExclusao) => {
        console.error(
          "Erro ao limpar upload:",
          erroExclusao,
        );
      });

    throw erro;
  }

  // Excluir a foto anterior somente após salvar a nova
  if (fotoAntiga) {
    await cloudinary.uploader
      .destroy(fotoAntiga, { invalidate: true })
      .catch((erro) => {
        console.error(
          "Erro ao excluir foto antiga:",
          erro,
        );
      });
  }

  return fotoPerfilUrl;
}

// Remover foto de perfil
export async function removerFotoPerfil(
  idUsuario: number,
) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id_Usuario: idUsuario,
    },
    select: {
      fotoPerfilPublicId: true,
    },
  });

  if (!usuario) {
    throw new HttpError(404, "Usuário não encontrado.");
  }

  await prisma.usuario.update({
    where: {
      id_Usuario: idUsuario,
    },
    data: {
      fotoPerfilUrl: null,
      fotoPerfilPublicId: null,
    },
  });

  if (usuario.fotoPerfilPublicId) {
    await cloudinary.uploader
      .destroy(usuario.fotoPerfilPublicId, {
        invalidate: true,
      })
      .catch((erro) => {
        console.error(
          "Erro ao remover imagem do Cloudinary:",
          erro,
        );
      });
  }
}