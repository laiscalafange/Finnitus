/*
  Warnings:

  - You are about to drop the `PerfilFinanceiro` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PerfilFinanceiro" DROP CONSTRAINT "PerfilFinanceiro_id_Usuario_fkey";

-- AlterTable
ALTER TABLE "ReservaFinanceira" ADD COLUMN     "tempo_economia" INTEGER;

-- DropTable
DROP TABLE "PerfilFinanceiro";
