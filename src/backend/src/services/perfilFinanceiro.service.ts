
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/errors.js";

// Dados recebidos da tela FinancialData.
type DadosPerfilFinanceiro = {
  renda_fixa: number | null;
  renda_variavel: number | null;
  despesas_mensais: number;
};

// Dados recebidos da tela FutureSavings.
type DadosReservaFinanceira = {
  economia_futura: number | null;
  tempo_economia: number | null;
};

// Salva ou atualiza os dados iniciais do perfil.
export async function salvarPerfilFinanceiro(
  idUsuario: number,
  dados: DadosPerfilFinanceiro
) {
  const valores = [
    dados.renda_fixa,
    dados.renda_variavel,
    dados.despesas_mensais,
  ];

  for (const valor of valores) {
    if (
      valor === undefined ||
      (valor !== null &&
        (!Number.isFinite(valor) || valor < 0))
    ) {
      throw new HttpError(400, "Informe valores financeiros válidos.");
    }
  }

  return prisma.perfilFinanceiro.upsert({
    where: { id_Usuario: idUsuario },
    create: {
      id_Usuario: idUsuario,
      renda_fixa: dados.renda_fixa,
      renda_variavel: dados.renda_variavel,
      despesas_mensais: dados.despesas_mensais,
    },
    update: {
      renda_fixa: dados.renda_fixa,
      renda_variavel: dados.renda_variavel,
      despesas_mensais: dados.despesas_mensais,
    },
  });
}

// Atualiza somente os dados da reserva de emergência.
export async function atualizarReservaFinanceira(
  idUsuario: number,
  dados: DadosReservaFinanceira
) {
  if (
    dados.economia_futura !== null &&
    (!Number.isFinite(dados.economia_futura) ||
      dados.economia_futura < 0)
  ) {
    throw new HttpError(400, "Informe um valor válido para a reserva.");
  }

  if (
    dados.tempo_economia !== null &&
    (!Number.isInteger(dados.tempo_economia) ||
      dados.tempo_economia < 1)
  ) {
    throw new HttpError(400, "Informe um prazo válido.");
  }

  return prisma.perfilFinanceiro.update({
    where: { id_Usuario: idUsuario },
    data: {
      economia_futura: dados.economia_futura,
      tempo_economia: dados.tempo_economia,
    },
  });
}

// Busca o perfil financeiro do usuário.
export async function buscarPerfilFinanceiro(idUsuario: number) {
  return prisma.perfilFinanceiro.findUnique({
    where: { id_Usuario: idUsuario },
  });
}
