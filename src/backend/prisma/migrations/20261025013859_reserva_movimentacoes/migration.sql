-- CreateEnum
CREATE TYPE "TipoMovimentacaoReserva" AS ENUM ('DEPOSITO', 'RETIRADA');

-- AlterTable
ALTER TABLE "ReservaFinanceira" ALTER COLUMN "valor_atual" SET DEFAULT 0,
ALTER COLUMN "valor_desejado" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "MovimentacaoReserva" (
    "id_Movimentacao" SERIAL NOT NULL,
    "id_Reserva" INTEGER NOT NULL,
    "tipo" "TipoMovimentacaoReserva" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimentacaoReserva_pkey" PRIMARY KEY ("id_Movimentacao")
);

-- CreateIndex
CREATE INDEX "MovimentacaoReserva_id_Reserva_data_idx" ON "MovimentacaoReserva"("id_Reserva", "data");

-- AddForeignKey
ALTER TABLE "MovimentacaoReserva" ADD CONSTRAINT "MovimentacaoReserva_id_Reserva_fkey" FOREIGN KEY ("id_Reserva") REFERENCES "ReservaFinanceira"("id_Reserva") ON DELETE CASCADE ON UPDATE CASCADE;
