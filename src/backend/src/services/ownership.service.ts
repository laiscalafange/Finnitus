import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

/** Foreign keys de entidades pessoais não podem apontar para outro usuário. */
export async function assertOwnedCategory(
  idUsuario: number,
  idCategoriaPersonalizada: number | null | undefined,
) {
  if (idCategoriaPersonalizada == null) return;
  if (!Number.isSafeInteger(idCategoriaPersonalizada) || idCategoriaPersonalizada <= 0) {
    throw new HttpError(400, "Categoria inválida.");
  }
  const found = await prisma.categoriaPersonalizada.findFirst({
    where: { id_CategoriaPersonalizada: idCategoriaPersonalizada, id_Usuario: idUsuario },
    select: { id_CategoriaPersonalizada: true },
  });
  if (!found) throw new HttpError(400, "Categoria indisponível para sua conta.");
}

export async function assertOwnedLinks(
  idUsuario: number,
  idReceita: number | null | undefined,
  idDespesa: number | null | undefined,
) {
  if (idReceita != null) {
    if (!Number.isSafeInteger(idReceita) || idReceita <= 0 ||
      !await prisma.receita.findFirst({ where: { id_Receita: idReceita, id_Usuario: idUsuario }, select: { id_Receita: true } })) {
      throw new HttpError(400, "Receita vinculada indisponível.");
    }
  }
  if (idDespesa != null) {
    if (!Number.isSafeInteger(idDespesa) || idDespesa <= 0 ||
      !await prisma.despesa.findFirst({ where: { id_Despesa: idDespesa, id_Usuario: idUsuario }, select: { id_Despesa: true } })) {
      throw new HttpError(400, "Despesa vinculada indisponível.");
    }
  }
}
