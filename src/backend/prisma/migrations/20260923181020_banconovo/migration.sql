/*
  Warnings:

  - You are about to drop the column `data` on the `Despesa` table. All the data in the column will be lost.
  - You are about to drop the column `impacto_financeiro` on the `Evento` table. All the data in the column will be lost.
  - The `Mstatus` column on the `Meta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Gastos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `data_vencimento` to the `Despesa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequencia` to the `Despesa` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipo` on the `Despesa` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `tipo` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Imprevisto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Mprioridade` to the `Meta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gastos" DROP CONSTRAINT "Gastos_id_Usuario_fkey";

-- DropIndex
DROP INDEX "Despesa_data_idx";

-- AlterTable
ALTER TABLE "Despesa" DROP COLUMN "data",
ADD COLUMN     "data_pagamento" DATE,
ADD COLUMN     "data_vencimento" DATE NOT NULL,
ADD COLUMN     "forma_pagamento" "FormaPagamento",
ADD COLUMN     "frequencia" "Frequencia" NOT NULL,
ADD COLUMN     "status" "StatusDespesa" NOT NULL DEFAULT 'PENDENTE',
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "DespesaTipo" NOT NULL;

-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "impacto_financeiro",
ADD COLUMN     "id_Categoria" INTEGER,
ADD COLUMN     "tipo" "TipoEvento" NOT NULL,
ADD COLUMN     "valor_relacionado" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Imprevisto" ADD COLUMN     "duracao_meses" INTEGER,
ADD COLUMN     "tipo" "TipoImprevisto" NOT NULL;

-- AlterTable
ALTER TABLE "Meta" ADD COLUMN     "Mprioridade" "PrioridadeMeta" NOT NULL,
ADD COLUMN     "Mvalor_periodo" DECIMAL(10,2),
DROP COLUMN "Mstatus",
ADD COLUMN     "Mstatus" "StatusMeta" NOT NULL DEFAULT 'EM_ANDAMENTO';

-- DropTable
DROP TABLE "Gastos";

-- CreateTable
CREATE TABLE "MovimentacaoMeta" (
    "id_Movimentacao" SERIAL NOT NULL,
    "id_Meta" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "tipo" "TipoMovimentacaoMeta" NOT NULL,
    "data" DATE NOT NULL,
    "descricao" VARCHAR(255),

    CONSTRAINT "MovimentacaoMeta_pkey" PRIMARY KEY ("id_Movimentacao")
);

-- CreateTable
CREATE TABLE "Divida" (
    "id_Divida" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "id_Categoria" INTEGER,
    "nome" VARCHAR(100) NOT NULL,
    "valor_total" DECIMAL(10,2) NOT NULL,
    "valor_parcela" DECIMAL(10,2) NOT NULL,
    "quantidade_parcelas" INTEGER NOT NULL,
    "parcelas_restantes" INTEGER NOT NULL,
    "data_vencimento" DATE NOT NULL,
    "taxa_juros" DECIMAL(5,2),
    "status" "StatusDivida" NOT NULL DEFAULT 'ATIVA',

    CONSTRAINT "Divida_pkey" PRIMARY KEY ("id_Divida")
);

-- CreateTable
CREATE TABLE "ReservaFinanceira" (
    "id_Reserva" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "valor_atual" DECIMAL(10,2) NOT NULL,
    "valor_desejado" DECIMAL(10,2) NOT NULL,
    "objetivo" VARCHAR(255),
    "localizacao" VARCHAR(255),

    CONSTRAINT "ReservaFinanceira_pkey" PRIMARY KEY ("id_Reserva")
);

-- CreateIndex
CREATE INDEX "MovimentacaoMeta_id_Meta_idx" ON "MovimentacaoMeta"("id_Meta");

-- CreateIndex
CREATE INDEX "MovimentacaoMeta_data_idx" ON "MovimentacaoMeta"("data");

-- CreateIndex
CREATE INDEX "MovimentacaoMeta_id_Meta_data_idx" ON "MovimentacaoMeta"("id_Meta", "data");

-- CreateIndex
CREATE INDEX "Divida_id_Usuario_idx" ON "Divida"("id_Usuario");

-- CreateIndex
CREATE INDEX "Divida_id_Categoria_idx" ON "Divida"("id_Categoria");

-- CreateIndex
CREATE INDEX "Divida_data_vencimento_idx" ON "Divida"("data_vencimento");

-- CreateIndex
CREATE INDEX "Divida_id_Usuario_data_vencimento_idx" ON "Divida"("id_Usuario", "data_vencimento");

-- CreateIndex
CREATE UNIQUE INDEX "ReservaFinanceira_id_Usuario_key" ON "ReservaFinanceira"("id_Usuario");

-- CreateIndex
CREATE INDEX "Categoria_id_Usuario_idx" ON "Categoria"("id_Usuario");

-- CreateIndex
CREATE INDEX "Despesa_data_vencimento_idx" ON "Despesa"("data_vencimento");

-- CreateIndex
CREATE INDEX "Despesa_data_pagamento_idx" ON "Despesa"("data_pagamento");

-- CreateIndex
CREATE INDEX "Despesa_id_Usuario_data_vencimento_idx" ON "Despesa"("id_Usuario", "data_vencimento");

-- CreateIndex
CREATE INDEX "Evento_id_Categoria_idx" ON "Evento"("id_Categoria");

-- CreateIndex
CREATE INDEX "Evento_id_Usuario_Edata_idx" ON "Evento"("id_Usuario", "Edata");

-- CreateIndex
CREATE INDEX "Imprevisto_id_Usuario_Idata_idx" ON "Imprevisto"("id_Usuario", "Idata");

-- CreateIndex
CREATE INDEX "Meta_Mprazo_idx" ON "Meta"("Mprazo");

-- AddForeignKey
ALTER TABLE "MovimentacaoMeta" ADD CONSTRAINT "MovimentacaoMeta_id_Meta_fkey" FOREIGN KEY ("id_Meta") REFERENCES "Meta"("id_Meta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Divida" ADD CONSTRAINT "Divida_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaFinanceira" ADD CONSTRAINT "ReservaFinanceira_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
