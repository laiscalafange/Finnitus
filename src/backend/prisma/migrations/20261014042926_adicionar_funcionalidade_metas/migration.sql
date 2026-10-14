/*
  Warnings:

  - Added the required column `Mtipo` to the `Meta` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoMeta" AS ENUM ('LONGO_PRAZO', 'MENSAL');

-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_id_Usuario_fkey";

-- AlterTable
ALTER TABLE "Meta" ADD COLUMN     "Mdata_cancelamento" TIMESTAMP(3),
ADD COLUMN     "Mdata_conclusao" TIMESTAMP(3),
ADD COLUMN     "Mdata_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Mmes_referencia" DATE,
ADD COLUMN     "Mtipo" "TipoMeta" NOT NULL,
ALTER COLUMN "Mvalor_atual" SET DEFAULT 0,
ALTER COLUMN "Mprazo" DROP NOT NULL,
ALTER COLUMN "Mprioridade" SET DEFAULT 'MEDIA';

-- CreateIndex
CREATE INDEX "Meta_Mmes_referencia_idx" ON "Meta"("Mmes_referencia");

-- CreateIndex
CREATE INDEX "Meta_id_Usuario_Mstatus_idx" ON "Meta"("id_Usuario", "Mstatus");

-- CreateIndex
CREATE INDEX "Meta_id_Usuario_Mtipo_idx" ON "Meta"("id_Usuario", "Mtipo");

-- CreateIndex
CREATE INDEX "Meta_id_Usuario_Mmes_referencia_idx" ON "Meta"("id_Usuario", "Mmes_referencia");

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;
