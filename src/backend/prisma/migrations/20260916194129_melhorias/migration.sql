-- AlterTable
ALTER TABLE "Gastos" ALTER COLUMN "Gnome" SET DATA TYPE TEXT,
ALTER COLUMN "Gvalor" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "Gcategoria" SET DATA TYPE TEXT,
ALTER COLUMN "Gdata" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "Gdescricao" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Receita" (
    "id_Receita" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data" DATE NOT NULL,
    "categoria" VARCHAR(50) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "observacao" VARCHAR(255),
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receita_pkey" PRIMARY KEY ("id_Receita")
);

-- AddForeignKey
ALTER TABLE "Gastos" ADD CONSTRAINT "Gastos_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
