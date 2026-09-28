/*
  Warnings:

  - You are about to drop the column `id_Usuario` on the `Categoria` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome,tipo]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
*/

-- CreateEnum
CREATE TYPE "CategoriaTipo" AS ENUM ('RECEITA', 'DESPESA');

-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_id_Usuario_fkey";

-- DropForeignKey
ALTER TABLE "Despesa" DROP CONSTRAINT "Despesa_id_Categoria_fkey";

-- DropForeignKey
ALTER TABLE "Receita" DROP CONSTRAINT "Receita_id_Categoria_fkey";

-- DropIndex
DROP INDEX "Categoria_id_Usuario_idx";

-- DropIndex
DROP INDEX "Categoria_id_Usuario_nome_tipo_key";

-- AlterTable
ALTER TABLE "Categoria"
DROP COLUMN "id_Usuario",
ALTER COLUMN "tipo" TYPE "CategoriaTipo"
USING "tipo"::"CategoriaTipo";

-- AlterTable
ALTER TABLE "Despesa"
ADD COLUMN "id_CategoriaPersonalizada" INTEGER,
ALTER COLUMN "id_Categoria" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Divida"
ADD COLUMN "id_CategoriaPersonalizada" INTEGER;

-- AlterTable
ALTER TABLE "Receita"
ADD COLUMN "id_CategoriaPersonalizada" INTEGER,
ALTER COLUMN "id_Categoria" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CategoriaPersonalizada" (
    "id_CategoriaPersonalizada" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "tipo" "CategoriaTipo" NOT NULL,

    CONSTRAINT "CategoriaPersonalizada_pkey" PRIMARY KEY ("id_CategoriaPersonalizada")
);

-- CreateIndex
CREATE INDEX "CategoriaPersonalizada_id_Usuario_idx"
ON "CategoriaPersonalizada"("id_Usuario");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaPersonalizada_id_Usuario_nome_tipo_key"
ON "CategoriaPersonalizada"("id_Usuario", "nome", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_tipo_key"
ON "Categoria"("nome", "tipo");

-- CreateIndex
CREATE INDEX "Despesa_id_CategoriaPersonalizada_idx"
ON "Despesa"("id_CategoriaPersonalizada");

-- CreateIndex
CREATE INDEX "Divida_id_CategoriaPersonalizada_idx"
ON "Divida"("id_CategoriaPersonalizada");

-- CreateIndex
CREATE INDEX "Receita_id_CategoriaPersonalizada_idx"
ON "Receita"("id_CategoriaPersonalizada");

-- AddForeignKey
ALTER TABLE "Receita"
ADD CONSTRAINT "Receita_id_Categoria_fkey"
FOREIGN KEY ("id_Categoria")
REFERENCES "Categoria"("id_Categoria")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita"
ADD CONSTRAINT "Receita_id_CategoriaPersonalizada_fkey"
FOREIGN KEY ("id_CategoriaPersonalizada")
REFERENCES "CategoriaPersonalizada"("id_CategoriaPersonalizada")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriaPersonalizada"
ADD CONSTRAINT "CategoriaPersonalizada_id_Usuario_fkey"
FOREIGN KEY ("id_Usuario")
REFERENCES "Usuario"("id_Usuario")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa"
ADD CONSTRAINT "Despesa_id_Categoria_fkey"
FOREIGN KEY ("id_Categoria")
REFERENCES "Categoria"("id_Categoria")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa"
ADD CONSTRAINT "Despesa_id_CategoriaPersonalizada_fkey"
FOREIGN KEY ("id_CategoriaPersonalizada")
REFERENCES "CategoriaPersonalizada"("id_CategoriaPersonalizada")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Divida"
ADD CONSTRAINT "Divida_id_CategoriaPersonalizada_fkey"
FOREIGN KEY ("id_CategoriaPersonalizada")
REFERENCES "CategoriaPersonalizada"("id_CategoriaPersonalizada")
ON DELETE SET NULL
ON UPDATE CASCADE;