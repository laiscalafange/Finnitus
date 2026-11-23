import type { Prisma } from "../../generated/prisma/client.js";
import type { CategoriaTipo } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

/** Foreign keys de entidades pessoais não podem apontar para outro usuário. */
export async function assertOwnedCategory(
  tx: Prisma.TransactionClient,
  idUsuario: number,
  idCategoriaPersonalizada: number | null | undefined,
  tipo: CategoriaTipo,
) {
  if (idCategoriaPersonalizada == null) return;
  if (!Number.isInteger(idCategoriaPersonalizada) || idCategoriaPersonalizada <= 0 || idCategoriaPersonalizada > 2147483647) {
    throw new HttpError(400, "Categoria inválida.");
  }

  // Mantém a categoria disponível e com o mesmo tipo até gravar o vínculo.
  const [categoria] = await tx.$queryRaw<{ tipo: CategoriaTipo }[]>`
    SELECT "tipo" FROM "CategoriaPersonalizada"
    WHERE "id_CategoriaPersonalizada" = ${idCategoriaPersonalizada}
      AND "id_Usuario" = ${idUsuario}
    FOR SHARE
  `;
  if (!categoria) throw new HttpError(400, "Categoria indisponível para sua conta.");
  if (categoria.tipo !== tipo) throw new HttpError(400, "Tipo de categoria incompatível.");
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
