CREATE TYPE "TamanhoTexto" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

CREATE TABLE "ConfiguracaoUsuario" (
    "id_Usuario" INTEGER NOT NULL,
    "idioma" VARCHAR(10) NOT NULL DEFAULT 'pt-BR',
    "moeda" CHAR(3) NOT NULL DEFAULT 'BRL',
    "mostrarValores" BOOLEAN NOT NULL DEFAULT true,
    "tamanhoTexto" "TamanhoTexto" NOT NULL DEFAULT 'MEDIO',
    "vencimento" BOOLEAN NOT NULL DEFAULT true,
    "gastos" BOOLEAN NOT NULL DEFAULT true,
    "calendario" BOOLEAN NOT NULL DEFAULT true,
    "planoB" BOOLEAN NOT NULL DEFAULT true,
    "resumo" BOOLEAN NOT NULL DEFAULT true,
    "metas" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ConfiguracaoUsuario_pkey" PRIMARY KEY ("id_Usuario")
);

ALTER TABLE "ConfiguracaoUsuario" ADD CONSTRAINT "ConfiguracaoUsuario_id_Usuario_fkey"
    FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario")
    ON DELETE CASCADE ON UPDATE CASCADE;
