/*
  Warnings:

  - A unique constraint covering the columns `[Uemail]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "RedefinicaoSenha" (
    "id_Redefinicao" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "codigo_hash" VARCHAR(255) NOT NULL,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RedefinicaoSenha_pkey" PRIMARY KEY ("id_Redefinicao")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Uemail_key" ON "Usuario"("Uemail");

-- AddForeignKey
ALTER TABLE "RedefinicaoSenha" ADD CONSTRAINT "RedefinicaoSenha_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;
