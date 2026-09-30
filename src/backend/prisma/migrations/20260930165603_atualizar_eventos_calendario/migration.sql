/*
  Warnings:

  - You are about to drop the column `Edata` on the `Evento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_Receita]` on the table `Evento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_Despesa]` on the table `Evento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data_inicio` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrigemEvento" AS ENUM ('FINNITUS', 'DISPOSITIVO');

-- CreateEnum
CREATE TYPE "StatusFinanceiroEvento" AS ENUM ('NAO_ANALISADO', 'SUSPEITO', 'CONFIRMADO', 'NAO_FINANCEIRO');

-- DropForeignKey
ALTER TABLE "Evento" DROP CONSTRAINT "Evento_id_Usuario_fkey";

-- DropIndex
DROP INDEX "Evento_Edata_idx";

-- DropIndex
DROP INDEX "Evento_id_Usuario_Edata_idx";

-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "Edata",
ADD COLUMN     "data_fim" TIMESTAMP(3),
ADD COLUMN     "data_inicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dia_inteiro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "id_Despesa" INTEGER,
ADD COLUMN     "id_Receita" INTEGER,
ADD COLUMN     "id_evento_externo" VARCHAR(255),
ADD COLUMN     "origem" "OrigemEvento" NOT NULL DEFAULT 'FINNITUS',
ADD COLUMN     "status_financeiro" "StatusFinanceiroEvento" NOT NULL DEFAULT 'NAO_ANALISADO',
ALTER COLUMN "tipo" SET DEFAULT 'OUTRO';

-- CreateIndex
CREATE UNIQUE INDEX "Evento_id_Receita_key" ON "Evento"("id_Receita");

-- CreateIndex
CREATE UNIQUE INDEX "Evento_id_Despesa_key" ON "Evento"("id_Despesa");

-- CreateIndex
CREATE INDEX "Evento_data_inicio_idx" ON "Evento"("data_inicio");

-- CreateIndex
CREATE INDEX "Evento_id_Usuario_data_inicio_idx" ON "Evento"("id_Usuario", "data_inicio");

-- CreateIndex
CREATE INDEX "Evento_id_evento_externo_idx" ON "Evento"("id_evento_externo");

-- CreateIndex
CREATE INDEX "Evento_status_financeiro_idx" ON "Evento"("status_financeiro");

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_id_Receita_fkey" FOREIGN KEY ("id_Receita") REFERENCES "Receita"("id_Receita") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_id_Despesa_fkey" FOREIGN KEY ("id_Despesa") REFERENCES "Despesa"("id_Despesa") ON DELETE SET NULL ON UPDATE CASCADE;
