BEGIN;

-- Impede que a normalização junte duas contas diferentes.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Usuario"
    GROUP BY lower(btrim("Uemail"))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Existem e-mails duplicados após normalização. Revise as contas antes de continuar.';
  END IF;
END $$;

-- Padroniza e-mails já cadastrados.
UPDATE "Usuario"
SET "Uemail" = lower(btrim("Uemail"));

ALTER TABLE "Usuario"
ADD COLUMN IF NOT EXISTS "tokenVersion"
INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "RedefinicaoSenha"
ADD COLUMN IF NOT EXISTS "verificado"
BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "RedefinicaoSenha"
ADD COLUMN IF NOT EXISTS "tentativas"
INTEGER NOT NULL DEFAULT 0;

-- Pedidos antigos deixam de valer.
UPDATE "RedefinicaoSenha"
SET "usado" = true
WHERE "usado" = false;

COMMIT;