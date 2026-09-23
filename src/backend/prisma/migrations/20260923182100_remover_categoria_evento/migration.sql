/*
  Warnings:

  - You are about to drop the column `id_Categoria` on the `Evento` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Evento_id_Categoria_idx";

-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "id_Categoria";
