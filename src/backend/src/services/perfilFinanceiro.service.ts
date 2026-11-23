
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

// Dados recebidos da tela FinancialData.
type DadosPerfilFinanceiro = {
  renda_fixa: unknown;
  renda_variavel: unknown;
  despesas_mensais: unknown;
};

// Dados recebidos da tela FutureSavings.
type DadosReservaFinanceira = {
  economia_futura: unknown;
  tempo_economia: unknown;
};

function valorMonetarioValido(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor) && valor >= 0 && valor <= 99_999_999.99;
}

// Salva ou atualiza os dados iniciais do perfil.
export async function salvarPerfilFinanceiro(
  idUsuario: number,
  dados: DadosPerfilFinanceiro
) {
  const { renda_fixa, renda_variavel, despesas_mensais } = dados;
  if (
    (renda_fixa !== null && !valorMonetarioValido(renda_fixa)) ||
    (renda_variavel !== null && !valorMonetarioValido(renda_variavel)) ||
    !valorMonetarioValido(despesas_mensais)
  ) {
    throw new HttpError(400, "Informe valores financeiros válidos.");
  }

  const valores = { renda_fixa, renda_variavel, despesas_mensais };
  return prisma.perfilFinanceiro.upsert({
    where: { id_Usuario: idUsuario },
    create: { id_Usuario: idUsuario, ...valores },
    update: valores,
  });
}

// Atualiza somente os dados da reserva de emergência.
export async function atualizarReservaFinanceira(
  idUsuario: number,
  dados: DadosReservaFinanceira
) {
  const { economia_futura, tempo_economia } = dados;
  if (economia_futura !== null && !valorMonetarioValido(economia_futura)) {
    throw new HttpError(400, "Informe um valor válido para a reserva.");
  }

  if (
    tempo_economia !== null &&
    (typeof tempo_economia !== "number" ||
      !Number.isInteger(tempo_economia) ||
      tempo_economia < 1 ||
      tempo_economia > 2_147_483_647)
  ) {
    throw new HttpError(400, "Informe um prazo válido.");
  }

  const valores = { economia_futura, tempo_economia };
  return prisma.perfilFinanceiro.upsert({
    where: { id_Usuario: idUsuario },
    create: { id_Usuario: idUsuario, despesas_mensais: 0, ...valores },
    update: valores,
  });
}

// Busca o perfil financeiro do usuário.
export async function buscarPerfilFinanceiro(idUsuario: number) {
  return prisma.perfilFinanceiro.findUnique({
    where: { id_Usuario: idUsuario },
  });
}
