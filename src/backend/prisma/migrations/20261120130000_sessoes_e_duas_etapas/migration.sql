CREATE TYPE "TipoDesafio2FA" AS ENUM ('LOGIN', 'ATIVACAO', 'DESATIVACAO');

ALTER TABLE "Usuario" ADD COLUMN "duasEtapasAtiva" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "SessaoUsuario" (
    "id" VARCHAR(71) NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "tokenVersion" INTEGER NOT NULL,
    "dispositivo" VARCHAR(60) NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "revogadaEm" TIMESTAMP(3),

    CONSTRAINT "SessaoUsuario_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Desafio2FA" (
    "id" UUID NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "tipo" "TipoDesafio2FA" NOT NULL,
    "tokenVersion" INTEGER NOT NULL,
    "codigoHash" CHAR(64) NOT NULL,
    "dispositivo" VARCHAR(60),
    "sessaoId" VARCHAR(71),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "usadoEm" TIMESTAMP(3),
    "tentativas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Desafio2FA_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SessaoUsuario_id_Usuario_tokenVersion_expiraEm_idx"
    ON "SessaoUsuario"("id_Usuario", "tokenVersion", "expiraEm");

CREATE INDEX "Desafio2FA_id_Usuario_tipo_criadoEm_idx"
    ON "Desafio2FA"("id_Usuario", "tipo", "criadoEm");

ALTER TABLE "SessaoUsuario" ADD CONSTRAINT "SessaoUsuario_id_Usuario_fkey"
    FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Desafio2FA" ADD CONSTRAINT "Desafio2FA_id_Usuario_fkey"
    FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;
