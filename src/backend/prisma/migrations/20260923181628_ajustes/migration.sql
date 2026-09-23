-- AddForeignKey
ALTER TABLE "Divida" ADD CONSTRAINT "Divida_id_Categoria_fkey" FOREIGN KEY ("id_Categoria") REFERENCES "Categoria"("id_Categoria") ON DELETE SET NULL ON UPDATE CASCADE;
