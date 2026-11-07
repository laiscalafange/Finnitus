-- CreateTable
CREATE TABLE "PerfilFinanceiro" (
    "id_PerfilFinanceiro" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "renda_fixa" DECIMAL(10,2),
    "renda_variavel" DECIMAL(10,2),
    "despesas_mensais" DECIMAL(10,2) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerfilFinanceiro_pkey" PRIMARY KEY ("id_PerfilFinanceiro")
);

-- CreateIndex
CREATE UNIQUE INDEX "PerfilFinanceiro_id_Usuario_key" ON "PerfilFinanceiro"("id_Usuario");

-- CreateIndex
CREATE INDEX "PerfilFinanceiro_id_Usuario_idx" ON "PerfilFinanceiro"("id_Usuario");

-- AddForeignKey
ALTER TABLE "PerfilFinanceiro" ADD CONSTRAINT "PerfilFinanceiro_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;
