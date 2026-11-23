import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { obterDiaFinanceiro, somarMovimentacoesRealizadas } from "./gestaoFinanceira.totais.js";
import { registrarLoteNotificacoes, type DadosNotificacao } from "./notificacoes.service.js";

type Aviso = Omit<DadosNotificacao, "idUsuario">;
type Janela = { gte: Date; lte: Date };

const real = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const iso = (data: Date) => data.toISOString().slice(0, 10);
const textoData = (data: Date) => iso(data).split("-").reverse().join("/");

async function consultarVencimentos(tx: Prisma.TransactionClient, id_Usuario: number, janela: Janela): Promise<Aviso[]> {
  const [receitas, despesas, dividas] = await Promise.all([
    tx.receita.findMany({
      where: { id_Usuario, status: "PENDENTE", data_recebimento: janela },
      select: { id_Receita: true, descricao: true, data_recebimento: true },
    }),
    tx.despesa.findMany({
      where: { id_Usuario, status: "PENDENTE", data_vencimento: janela },
      select: { id_Despesa: true, descricao: true, data_vencimento: true },
    }),
    tx.divida.findMany({
      where: {
        id_Usuario,
        status: { in: ["ATIVA", "ATRASADA"] },
        parcelas_restantes: { gt: 0 },
        data_vencimento: janela,
      },
      select: { id_Divida: true, nome: true, data_vencimento: true },
    }),
  ]);

  return [
    ...receitas.map((receita): Aviso => ({
      tipo: "CONTA_VENCIMENTO",
      relacionadoTipo: "RECEITA",
      relacionadoId: receita.id_Receita,
      chaveEvento: `receita:${receita.id_Receita}:vencimento:${iso(receita.data_recebimento).slice(0, 7)}`,
      titulo: "Recebimento previsto",
      mensagem: `${receita.descricao} · ${textoData(receita.data_recebimento)}`,
    })),
    ...despesas.map((despesa): Aviso => ({
      tipo: "CONTA_VENCIMENTO",
      relacionadoTipo: "DESPESA",
      relacionadoId: despesa.id_Despesa,
      chaveEvento: `despesa:${despesa.id_Despesa}:vencimento:${iso(despesa.data_vencimento).slice(0, 7)}`,
      titulo: "Vencimento de conta",
      mensagem: `${despesa.descricao} · ${textoData(despesa.data_vencimento)}`,
    })),
    ...dividas.map((divida): Aviso => ({
      tipo: "CONTA_VENCIMENTO",
      relacionadoTipo: "DIVIDA",
      relacionadoId: divida.id_Divida,
      chaveEvento: `divida:${divida.id_Divida}:vencimento:${iso(divida.data_vencimento)}`,
      titulo: "Vencimento de dívida",
      mensagem: `${divida.nome} · ${textoData(divida.data_vencimento)}`,
    })),
  ];
}

async function consultarPrazosMetas(tx: Prisma.TransactionClient, id_Usuario: number, janela: Janela): Promise<Aviso[]> {
  const metas = await tx.meta.findMany({
    where: { id_Usuario, Mconfigurada: true, Mstatus: "EM_ANDAMENTO", Mprazo: janela },
    select: { id_Meta: true, Mnome: true, Mprazo: true },
  });

  return metas.flatMap(({ id_Meta, Mnome, Mprazo }): Aviso[] => Mprazo ? [{
    tipo: "META_PRAZO",
    relacionadoTipo: "META",
    relacionadoId: id_Meta,
    chaveEvento: `meta:${id_Meta}:prazo:${iso(Mprazo)}`,
    titulo: "Prazo de meta próximo",
    mensagem: `${Mnome} · ${textoData(Mprazo)}`,
  }] : []);
}

async function consultarResumoMensal(tx: Prisma.TransactionClient, id_Usuario: number, hoje: Date): Promise<Aviso[]> {
  const mesAtual = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), 1));
  const inicio = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() - 1, 1));
  const chaveEvento = `resumo:${iso(inicio).slice(0, 7)}`;
  const existente = await tx.notificacao.findUnique({
    where: { id_Usuario_chaveEvento: { id_Usuario, chaveEvento } },
    select: { id_Notificacao: true },
  });
  if (existente) return [];

  const { receitas, despesas } = await somarMovimentacoesRealizadas(tx, id_Usuario, inicio, mesAtual);
  if (receitas === 0 && despesas === 0) return [];

  return [{
    tipo: "RESUMO_MENSAL",
    chaveEvento,
    titulo: "Resumo financeiro do mês anterior",
    mensagem: `Recebido: ${real.format(receitas)}. Pago: ${real.format(despesas)}. Saldo: ${real.format(receitas - despesas)}.`,
  }];
}

export async function registrarAvisosPeriodicos(
  banco: Pick<PrismaClient, "$transaction">,
  idUsuario: number,
  agora = new Date(),
) {
  const hoje = new Date(obterDiaFinanceiro(agora));
  const limite = new Date(hoje);
  limite.setUTCDate(hoje.getUTCDate() + 7);
  const janelaMetas = { gte: hoje, lte: limite };
  const janelaContas = {
    gte: new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), 1)),
    lte: limite,
  };

  for (let tentativa = 1; ; tentativa++) {
    try {
      return await banco.$transaction(async (tx) => {
        const configuracao = await tx.configuracaoUsuario.findUnique({
          where: { id_Usuario: idUsuario },
          select: { vencimento: true, resumo: true, metas: true },
        });
        const [vencimentos, prazos, resumo] = await Promise.all([
          configuracao?.vencimento === false ? [] : consultarVencimentos(tx, idUsuario, janelaContas),
          configuracao?.metas === false ? [] : consultarPrazosMetas(tx, idUsuario, janelaMetas),
          configuracao?.resumo === false ? [] : consultarResumoMensal(tx, idUsuario, hoje),
        ]);
        return registrarLoteNotificacoes(tx, idUsuario, [...vencimentos, ...prazos, ...resumo]);
      }, { isolationLevel: "Serializable" });
    } catch (erro) {
      // Uma consulta concorrente ou o reset pode invalidar a leitura de origem.
      if (tentativa === 3 || (erro as { code?: string } | null)?.code !== "P2034") throw erro;
    }
  }
}
