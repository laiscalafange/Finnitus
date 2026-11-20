import type { TamanhoTexto } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

const booleanos = [
  "mostrarValores", "vencimento", "gastos", "calendario", "planoB", "resumo", "metas",
] as const;
const tamanhos: readonly TamanhoTexto[] = ["PEQUENO", "MEDIO", "GRANDE"];

type Configuracao = Record<(typeof booleanos)[number], boolean> & {
  idioma: string;
  moeda: string;
  tamanhoTexto: TamanhoTexto;
};

const padrao: Configuracao = {
  idioma: "pt-BR",
  moeda: "BRL",
  mostrarValores: true,
  tamanhoTexto: "MEDIO",
  vencimento: true,
  gastos: true,
  calendario: true,
  planoB: true,
  resumo: true,
  metas: true,
};

const campos = {
  idioma: true,
  moeda: true,
  mostrarValores: true,
  tamanhoTexto: true,
  vencimento: true,
  gastos: true,
  calendario: true,
  planoB: true,
  resumo: true,
  metas: true,
} as const;

export async function buscarConfiguracaoUsuario(id: number): Promise<Configuracao> {
  return (await prisma.configuracaoUsuario.findUnique({
    where: { id_Usuario: id },
    select: campos,
  })) ?? padrao;
}

export function validarConfiguracao(body: unknown): Partial<Configuracao> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Informe as configurações que deseja alterar.");
  }
  const valores = Object.entries(body);
  if (!valores.length) {
    throw new HttpError(400, "Informe as configurações que deseja alterar.");
  }

  for (const [chave, valor] of valores) {
    const valido =
      (chave === "moeda" && valor === "BRL") ||
      (chave === "idioma" && valor === "pt-BR") ||
      (chave === "tamanhoTexto" && tamanhos.some((tamanho) => tamanho === valor)) ||
      (booleanos.some((campo) => campo === chave) && typeof valor === "boolean");
    if (!valido) {
      throw new HttpError(400, "Foi informada uma configuração ou opção inválida.");
    }
  }
  return Object.fromEntries(valores);
}

export function salvarConfiguracaoUsuario(id: number, dados: Partial<Configuracao>) {
  return prisma.configuracaoUsuario.upsert({
    where: { id_Usuario: id },
    create: { id_Usuario: id, ...dados },
    update: dados,
    select: campos,
  });
}

export async function excluirDadosFinanceiros(id: number) {
  const where = { id_Usuario: id };
  try {
    await prisma.$transaction(async (tx) => {
      await tx.evento.deleteMany({
        where: {
          ...where,
          OR: [
            { tipo: { in: ["RECEBIMENTO", "PAGAMENTO", "META"] } },
            { status_financeiro: "CONFIRMADO" },
            { valor_relacionado: { not: null } },
            { id_Receita: { not: null } },
            { id_Despesa: { not: null } },
          ],
        },
      });
      await tx.receita.deleteMany({ where });
      await tx.despesa.deleteMany({ where });
      await tx.divida.deleteMany({ where });
      await tx.meta.deleteMany({ where });
      await tx.imprevisto.deleteMany({ where });
      await tx.reservaFinanceira.deleteMany({ where });
      await tx.perfilFinanceiro.deleteMany({ where });
      await tx.categoriaPersonalizada.deleteMany({ where });
      await tx.notificacao.deleteMany({ where });
    }, { isolationLevel: "Serializable" });
  } catch (error) {
    if ((error as { code?: string }).code === "P2034") {
      throw new HttpError(409, "Houve outra alteração nos seus dados. Tente novamente.");
    }
    throw error;
  }
}
