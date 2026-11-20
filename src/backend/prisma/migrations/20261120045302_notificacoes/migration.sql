-- CreateTable
CREATE TABLE "Notificacao" (
    "id_Notificacao" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "tipo" VARCHAR(40) NOT NULL,
    "titulo" VARCHAR(120) NOT NULL,
    "mensagem" VARCHAR(500) NOT NULL,
    "chaveEvento" VARCHAR(180) NOT NULL,
    "relacionadoTipo" VARCHAR(20),
    "relacionadoId" INTEGER,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lidaEm" TIMESTAMP(3),

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id_Notificacao")
);

-- CreateIndex
CREATE INDEX "Notificacao_id_Usuario_criadaEm_idx" ON "Notificacao"("id_Usuario", "criadaEm");

-- CreateIndex
CREATE INDEX "Notificacao_id_Usuario_lida_criadaEm_idx" ON "Notificacao"("id_Usuario", "lida", "criadaEm");

-- CreateIndex
CREATE UNIQUE INDEX "Notificacao_id_Usuario_chaveEvento_key" ON "Notificacao"("id_Usuario", "chaveEvento");

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;
