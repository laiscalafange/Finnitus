import type { Prisma } from "../../generated/prisma/client.js";
import { registrarLoteNotificacoes, type DadosNotificacao } from "./notificacoes.service.js";

type BancoAvisos = Pick<Prisma.TransactionClient, "configuracaoUsuario" | "notificacao" | "receita" | "despesa">;

const diaBrasil = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" });
const real = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const iso = (data: Date) => data.toISOString().slice(0, 10);

export async function registrarAvisosPeriodicos(banco: BancoAvisos, idUsuario: number, agora = new Date()) {
  const where = { id_Usuario: idUsuario };
  const { vencimento = true, resumo = true } = await banco.configuracaoUsuario.findUnique({
    where,
    select: { vencimento: true, resumo: true },
  }) ?? {};
  if (!vencimento && !resumo) return;

  const hoje = new Date(diaBrasil.format(agora));
  const limite = new Date(+hoje + 7 * 86400000);
  const mesAtual = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), 1));
  const mesAnterior = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() - 1, 1));
  const chaveResumo = `resumo:${iso(mesAnterior).slice(0, 7)}`;
  const precisaResumo = resumo && !await banco.notificacao.findUnique({
    where: { id_Usuario_chaveEvento: { ...where, chaveEvento: chaveResumo } },
    select: { id_Notificacao: true },
  });
  if (!vencimento && !precisaResumo) return;

  const janelaVencimento = { gte: mesAtual, lte: limite };
  const mesFechado = { gte: mesAnterior, lt: mesAtual };
  const pendente = { status: "PENDENTE" } as const;
  const [receitas, despesas] = await Promise.all([
    banco.receita.findMany({
      where: {
        ...where,
        OR: [
          ...(vencimento ? [{ ...pendente, data_recebimento: janelaVencimento }] : []),
          ...(precisaResumo ? [{ status: "RECEBIDA" as const, data_recebimento: mesFechado }] : []),
        ],
      },
      select: { id_Receita: true, status: true, descricao: true, data_recebimento: true, valor: true },
    }),
    banco.despesa.findMany({
      where: {
        ...where,
        OR: [
          ...(vencimento ? [{ ...pendente, data_vencimento: janelaVencimento }] : []),
          ...(precisaResumo ? [{
            status: "PAGA" as const,
            OR: [
              { data_pagamento: mesFechado },
              { data_pagamento: null, data_vencimento: mesFechado },
            ],
          }] : []),
        ],
      },
      select: { id_Despesa: true, status: true, descricao: true, data_vencimento: true, valor: true },
    }),
  ]);

  let entradas = 0;
  let saidas = 0;
  const avisos: Omit<DadosNotificacao, "idUsuario">[] = [];
  for (const conta of [...receitas, ...despesas]) {
    const receita = "id_Receita" in conta;
    if (conta.status !== "PENDENTE") {
      if (receita) entradas += Number(conta.valor);
      else saidas += Number(conta.valor);
      continue;
    }

    const id = receita ? conta.id_Receita : conta.id_Despesa;
    const tipo = receita ? "RECEITA" : "DESPESA";
    const data = iso(receita ? conta.data_recebimento : conta.data_vencimento);
    const textoData = data.split("-").reverse().join("/");
    avisos.push({
      tipo: "CONTA_VENCIMENTO",
      relacionadoTipo: tipo,
      relacionadoId: id,
      chaveEvento: `${tipo.toLowerCase()}:${id}:vencimento:${data.slice(0, 7)}`,
      titulo: receita ? "Recebimento previsto" : "Vencimento de conta",
      mensagem: `${conta.descricao} · ${textoData}`,
    });
  }

  if (precisaResumo && (entradas || saidas)) {
    avisos.push({
      tipo: "RESUMO_MENSAL",
      chaveEvento: chaveResumo,
      titulo: "Resumo financeiro do mês anterior",
      mensagem: `Recebido: ${real.format(entradas)}. Pago: ${real.format(saidas)}.`,
    });
  }
  // As chaves únicas tornam a atualização idempotente entre dispositivos.
  await registrarLoteNotificacoes(banco, idUsuario, avisos);
}
