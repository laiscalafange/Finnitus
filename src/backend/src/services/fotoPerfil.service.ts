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

  const { cloud_name, api_key, api_secret } = cloudinary.config();
  if (!cloud_name || !api_key || !api_secret) {
    throw new HttpError(503, "O armazenamento de fotos de perfil está indisponível.");
  }

  return new Promise<FotoEnviada>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "finnitus/fotos-perfil",
        resource_type: "image",
      },
      (erro, resultado) => {
        if (erro || !resultado?.secure_url || !resultado.public_id) {
          reject(erro);
          return;
        }

        resolve({
          url: resultado.secure_url,
          publicId: resultado.public_id,
        });
      },
    );

    stream.on("error", reject);
    stream.end(imagem);
  }).catch(() => {
    throw new HttpError(502, "Não foi possível armazenar a foto.");
  });
}

async function excluirImagem(publicId: string | null) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch {
    console.error("Não foi possível remover uma foto de perfil do Cloudinary.");
  }
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

  const fotoNova = await enviarImagem(arquivo);

  try {
    const atualizado = await prisma.usuario.updateMany({
      where: {
        id_Usuario: idUsuario,
        fotoPerfilPublicId: usuario.fotoPerfilPublicId,
      },
      data: {
        fotoPerfilUrl: fotoNova.url,
        fotoPerfilPublicId: fotoNova.publicId,
      },
    });
    if (atualizado.count === 0) {
      throw new HttpError(409, "A foto foi alterada em outra solicitação. Tente novamente.");
    }
  } catch (erro) {
    await excluirImagem(fotoNova.publicId);
    throw erro;
  }

  await excluirImagem(usuario.fotoPerfilPublicId);
  return fotoNova.url;
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

  const removida = await prisma.usuario.updateMany({
    where: {
      id_Usuario: idUsuario,
      fotoPerfilPublicId: usuario.fotoPerfilPublicId,
    },
    data: {
      fotoPerfilUrl: null,
      fotoPerfilPublicId: null,
    },
  });

  if (removida.count === 0) {
    throw new HttpError(409, "A foto foi alterada em outra solicitação. Tente novamente.");
  }
  await excluirImagem(usuario.fotoPerfilPublicId);
}
