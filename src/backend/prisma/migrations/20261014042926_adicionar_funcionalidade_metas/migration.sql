
/*
  Atualização da tabela Meta.

  Preserva as metas existentes.
  As metas antigas serão classificadas como LONGO_PRAZO.
*/

BEGIN;

-- Criar enum dos tipos de meta
CREATE TYPE "TipoMeta" AS ENUM (
  'LONGO_PRAZO',
  'MENSAL'
);

-- Remover temporariamente a chave estrangeira
ALTER TABLE "Meta"
DROP CONSTRAINT "Meta_id_Usuario_fkey";

-- Adicionar os novos campos
ALTER TABLE "Meta"
ADD COLUMN "Mdata_cancelamento" TIMESTAMP(3),
ADD COLUMN "Mdata_conclusao" TIMESTAMP(3),
ADD COLUMN "Mdata_criacao" TIMESTAMP(3)
  NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "Mmes_referencia" DATE,
ADD COLUMN "Mtipo" "TipoMeta",
ALTER COLUMN "Mvalor_atual" SET DEFAULT 0,
ALTER COLUMN "Mprazo" DROP NOT NULL,
ALTER COLUMN "Mprioridade" SET DEFAULT 'MEDIA';

-- Preservar metas antigas atribuindo um tipo
UPDATE "Meta"
SET "Mtipo" = 'LONGO_PRAZO'
WHERE "Mtipo" IS NULL;

-- Tornar o tipo obrigatório
ALTER TABLE "Meta"
ALTER COLUMN "Mtipo" SET NOT NULL;

-- Índices
CREATE INDEX "Meta_Mmes_referencia_idx"
ON "Meta"("Mmes_referencia");

CREATE INDEX "Meta_id_Usuario_Mstatus_idx"
ON "Meta"("id_Usuario", "Mstatus");

CREATE INDEX "Meta_id_Usuario_Mtipo_idx"
ON "Meta"("id_Usuario", "Mtipo");

CREATE INDEX "Meta_id_Usuario_Mmes_referencia_idx"
ON "Meta"("id_Usuario", "Mmes_referencia");

-- Restaurar a chave estrangeira
ALTER TABLE "Meta"
ADD CONSTRAINT "Meta_id_Usuario_fkey"
FOREIGN KEY ("id_Usuario")
REFERENCES "Usuario"("id_Usuario")
ON DELETE CASCADE
ON UPDATE CASCADE;

COMMIT;
