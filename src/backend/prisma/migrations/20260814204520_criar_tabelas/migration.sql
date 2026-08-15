-- CreateTable
CREATE TABLE "Usuario" (
    "id_Usuario" SERIAL NOT NULL,
    "Unome" VARCHAR(100) NOT NULL,
    "Usenha" VARCHAR(255) NOT NULL,
    "Uemail" VARCHAR(100) NOT NULL,
    "Utelefone" VARCHAR(15) NOT NULL,
    "Udata_nasc" DATE NOT NULL,
    "Udata_cadastro" TIMESTAMP(3) NOT NULL,
    "UTipo" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_Usuario")
);

-- CreateTable
CREATE TABLE "EntradaDinheiro" (
    "id_Dinheiro" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Dnome" VARCHAR(100) NOT NULL,
    "Dvalor" DECIMAL(10,2) NOT NULL,
    "Ddata" DATE NOT NULL,
    "Ddescricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "EntradaDinheiro_pkey" PRIMARY KEY ("id_Dinheiro")
);

-- CreateTable
CREATE TABLE "Gastos" (
    "id_Gasto" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Gnome" VARCHAR(100) NOT NULL,
    "Gvalor" DECIMAL(10,2) NOT NULL,
    "Gcategoria" VARCHAR(50) NOT NULL,
    "Gdata" DATE NOT NULL,
    "Gdescricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "Gastos_pkey" PRIMARY KEY ("id_Gasto")
);

-- CreateTable
CREATE TABLE "Metas" (
    "id_Meta" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Mnome" VARCHAR(100) NOT NULL,
    "Mvalor_objetivo" DECIMAL(10,2) NOT NULL,
    "Mvalor_atual" DECIMAL(10,2) NOT NULL,
    "Mprazo" DATE NOT NULL,
    "Mstatus" TEXT NOT NULL,

    CONSTRAINT "Metas_pkey" PRIMARY KEY ("id_Meta")
);

-- CreateTable
CREATE TABLE "Imprevistos" (
    "id_Imprevisto" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Inome" VARCHAR(100) NOT NULL,
    "Ivalor" DECIMAL(10,2) NOT NULL,
    "solucao_escolhida" VARCHAR(100) NOT NULL,
    "Idata" DATE NOT NULL,
    "Idescricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "Imprevistos_pkey" PRIMARY KEY ("id_Imprevisto")
);

-- CreateTable
CREATE TABLE "Eventos" (
    "id_Evento" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Enome" VARCHAR(100) NOT NULL,
    "impacto_financeiro" DECIMAL(10,2) NOT NULL,
    "Edata" DATE NOT NULL,
    "Edescricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "Eventos_pkey" PRIMARY KEY ("id_Evento")
);

-- CreateTable
CREATE TABLE "AnaliseSentimental" (
    "id_Sentimento" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Shumor" VARCHAR(40) NOT NULL,
    "nivel_estresse" INTEGER NOT NULL,
    "estado_sentimental" VARCHAR(50) NOT NULL,
    "Sdata" DATE NOT NULL,
    "Scomentario" VARCHAR(50) NOT NULL,

    CONSTRAINT "AnaliseSentimental_pkey" PRIMARY KEY ("id_Sentimento")
);
