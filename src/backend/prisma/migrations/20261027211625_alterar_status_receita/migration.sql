
-- Inicia a transação para realizar a alteração de forma controlada.
BEGIN;

-- Cria um novo enum com os status desejados.
CREATE TYPE "StatusReceita_new" AS ENUM ('RECEBIDA', 'PENDENTE');

-- Remove temporariamente o valor padrão da coluna.
ALTER TABLE "public"."Receita"
ALTER COLUMN "status" DROP DEFAULT;

-- Converte os registros antigos para os novos status.
-- ATIVA passa a RECEBIDA e INATIVA passa a PENDENTE.
ALTER TABLE "public"."Receita"
ALTER COLUMN "status" TYPE "StatusReceita_new"
USING (
  CASE
    WHEN "status"::text = 'ATIVA' THEN 'RECEBIDA'
    WHEN "status"::text = 'INATIVA' THEN 'PENDENTE'
    ELSE "status"::text
  END
)::"StatusReceita_new";

-- Substitui o enum antigo pelo novo.
ALTER TYPE "StatusReceita" RENAME TO "StatusReceita_old";
ALTER TYPE "StatusReceita_new" RENAME TO "StatusReceita";

-- Exclui o enum antigo depois da conversão dos registros.
DROP TYPE "StatusReceita_old";

-- Define PENDENTE como padrão para novos registros.
ALTER TABLE "public"."Receita"
ALTER COLUMN "status" SET DEFAULT 'PENDENTE';

COMMIT;
