-- CreateTable
CREATE TABLE "Usuario" (
    "id_Usuario" SERIAL NOT NULL,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "googleId" VARCHAR(255),
    "Unome" VARCHAR(100) NOT NULL,
    "Usenha" VARCHAR(255),
    "Uemail" VARCHAR(100) NOT NULL,
    "Utelefone" VARCHAR(15),
    "Udata_nasc" DATE,
    "Udata_cadastro" TIMESTAMP(3) NOT NULL,
    "UTipo" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_Usuario")
);

-- CreateTable
CREATE TABLE "RedefinicaoSenha" (
    "id_Redefinicao" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "codigo_hash" VARCHAR(255) NOT NULL,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "verificado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RedefinicaoSenha_pkey" PRIMARY KEY ("id_Redefinicao")
);

-- CreateTable
CREATE TABLE "Receita" (
    "id_Receita" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "id_Categoria" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data" DATE NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "observacao" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receita_pkey" PRIMARY KEY ("id_Receita")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id_Categoria" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id_Categoria")
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id_Despesa" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "id_Categoria" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data" DATE NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "observacao" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Despesa_pkey" PRIMARY KEY ("id_Despesa")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id_Evento" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Enome" VARCHAR(100) NOT NULL,
    "impacto_financeiro" DECIMAL(10,2) NOT NULL,
    "Edata" DATE NOT NULL,
    "Edescricao" VARCHAR(255),

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id_Evento")
);

-- CreateTable
CREATE TABLE "Imprevisto" (
    "id_Imprevisto" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Inome" VARCHAR(100) NOT NULL,
    "Ivalor" DECIMAL(10,2) NOT NULL,
    "solucao_escolhida" VARCHAR(100),
    "Idata" DATE NOT NULL,
    "Idescricao" VARCHAR(255),

    CONSTRAINT "Imprevisto_pkey" PRIMARY KEY ("id_Imprevisto")
);

-- CreateTable
CREATE TABLE "Gastos" (
    "id_Gasto" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Gnome" TEXT NOT NULL,
    "Gvalor" DECIMAL(65,30) NOT NULL,
    "Gcategoria" TEXT NOT NULL,
    "Gdata" TIMESTAMP(3) NOT NULL,
    "Gdescricao" TEXT NOT NULL,

    CONSTRAINT "Gastos_pkey" PRIMARY KEY ("id_Gasto")
);

-- CreateTable
CREATE TABLE "Meta" (
    "id_Meta" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Mnome" VARCHAR(100) NOT NULL,
    "Mvalor_objetivo" DECIMAL(10,2) NOT NULL,
    "Mvalor_atual" DECIMAL(10,2) NOT NULL,
    "Mprazo" DATE NOT NULL,
    "Mstatus" TEXT NOT NULL,

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id_Meta")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_googleId_key" ON "Usuario"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Uemail_key" ON "Usuario"("Uemail");

-- CreateIndex
CREATE INDEX "Receita_data_idx" ON "Receita"("data");

-- CreateIndex
CREATE INDEX "Receita_id_Categoria_idx" ON "Receita"("id_Categoria");

-- CreateIndex
CREATE INDEX "Receita_id_Usuario_idx" ON "Receita"("id_Usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_id_Usuario_nome_tipo_key" ON "Categoria"("id_Usuario", "nome", "tipo");

-- CreateIndex
CREATE INDEX "Despesa_data_idx" ON "Despesa"("data");

-- CreateIndex
CREATE INDEX "Despesa_id_Categoria_idx" ON "Despesa"("id_Categoria");

-- CreateIndex
CREATE INDEX "Despesa_id_Usuario_idx" ON "Despesa"("id_Usuario");

-- CreateIndex
CREATE INDEX "Evento_Edata_idx" ON "Evento"("Edata");

-- CreateIndex
CREATE INDEX "Evento_id_Usuario_idx" ON "Evento"("id_Usuario");

-- CreateIndex
CREATE INDEX "Imprevisto_Idata_idx" ON "Imprevisto"("Idata");

-- CreateIndex
CREATE INDEX "Imprevisto_id_Usuario_idx" ON "Imprevisto"("id_Usuario");

-- CreateIndex
CREATE INDEX "Meta_id_Usuario_idx" ON "Meta"("id_Usuario");

-- AddForeignKey
ALTER TABLE "RedefinicaoSenha" ADD CONSTRAINT "RedefinicaoSenha_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_id_Categoria_fkey" FOREIGN KEY ("id_Categoria") REFERENCES "Categoria"("id_Categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_id_Categoria_fkey" FOREIGN KEY ("id_Categoria") REFERENCES "Categoria"("id_Categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imprevisto" ADD CONSTRAINT "Imprevisto_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gastos" ADD CONSTRAINT "Gastos_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
