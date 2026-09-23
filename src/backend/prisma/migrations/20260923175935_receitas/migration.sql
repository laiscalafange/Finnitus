/*
  Warnings:

  - You are about to drop the column `data` on the `Receita` table. All the data in the column will be lost.
  - Added the required column `data_recebimento` to the `Receita` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequencia` to the `Receita` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipo` on the `Receita` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReceitaTipo" AS ENUM ('FIXA', 'VARIAVEL');

-- CreateEnum
CREATE TYPE "Frequencia" AS ENUM ('UNICA', 'SEMANAL', 'QUINZENAL', 'MENSAL', 'ANUAL');

-- CreateEnum
CREATE TYPE "StatusReceita" AS ENUM ('ATIVA', 'INATIVA');

-- CreateEnum
CREATE TYPE "DespesaTipo" AS ENUM ('FIXA', 'VARIAVEL');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'DEBITO', 'CREDITO', 'BOLETO');

-- CreateEnum
CREATE TYPE "StatusDespesa" AS ENUM ('PAGA', 'PENDENTE');

-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('RECEBIMENTO', 'PAGAMENTO', 'META', 'OUTRO');

-- CreateEnum
CREATE TYPE "PrioridadeMeta" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "StatusMeta" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusDivida" AS ENUM ('ATIVA', 'QUITADA', 'ATRASADA');

-- CreateEnum
CREATE TYPE "TipoImprevisto" AS ENUM ('PERDA_RENDA', 'AUMENTO_DESPESA', 'DESPESA_INESPERADA', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoMovimentacaoMeta" AS ENUM ('APORTE', 'RETIRADA');

-- DropIndex
DROP INDEX "Receita_data_idx";

-- AlterTable
ALTER TABLE "Receita" DROP COLUMN "data",
ADD COLUMN     "data_recebimento" DATE NOT NULL,
ADD COLUMN     "frequencia" "Frequencia" NOT NULL,
ADD COLUMN     "status" "StatusReceita" NOT NULL DEFAULT 'ATIVA',
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "ReceitaTipo" NOT NULL;

-- CreateIndex
CREATE INDEX "Receita_data_recebimento_idx" ON "Receita"("data_recebimento");

-- CreateIndex
CREATE INDEX "Receita_id_Usuario_data_recebimento_idx" ON "Receita"("id_Usuario", "data_recebimento");
