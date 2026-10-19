
import { prisma } from "../lib/prisma.js";
import { gerarRespostaGemini } from "./gemini.service.js";

type Frequencia = "UNICA" | "SEMANAL" | "QUINZENAL" | "MENSAL" | "ANUAL";

type TipoImprevisto =
  | "PERDA_RENDA"
  | "AUMENTO_DESPESA"
  | "DESPESA_INESPERADA"
  | "OUTRO";

interface DadosPlanoB {
  imprevisto: {
    Inome: string;
    tipo: TipoImprevisto;
    Ivalor: number;
    Idata: string;
    duracao_meses?: number;
    solucao_escolhida?: string;
    Idescricao?: string;
  };
}

function converterParaNumero(valor: unknown): number {
  return Number(valor ?? 0);
}

function calcularValorMensal(
  valor: number,
  frequencia: Frequencia,
  data: Date
): number {
  switch (frequencia) {
    case "SEMANAL":
      return (valor * 52) / 12;

    case "QUINZENAL":
      return valor * 2;

    case "MENSAL":
      return valor;

    case "ANUAL":
      return valor / 12;

    case "UNICA": {
      const hoje = new Date();

      const mesmoMes =
        data.getFullYear() === hoje.getFullYear() &&
        data.getMonth() === hoje.getMonth();

      return mesmoMes ? valor : 0;
    }
  }
}

export async function analisarPlanoB(
  id_Usuario: number,
  dados: DadosPlanoB
) {
  // Busca os dados financeiros pertencentes ao usuário autenticado.
  const [receitas, despesas, dividas, reserva] = await Promise.all([
    prisma.receita.findMany({
      where: {
        id_Usuario,
        status: "ATIVA",
      },
      select: {
        valor: true,
        frequencia: true,
        data_recebimento: true,
      },
    }),

    prisma.despesa.findMany({
      where: { id_Usuario },
      select: {
        valor: true,
        frequencia: true,
        data_vencimento: true,
      },
    }),

    prisma.divida.findMany({
      where: {
        id_Usuario,
        status: { in: ["ATIVA", "ATRASADA"] },
        parcelas_restantes: { gt: 0 },
      },
      select: {
        valor_parcela: true,
      },
    }),

    prisma.reservaFinanceira.findUnique({
      where: { id_Usuario },
      select: { valor_atual: true },
    }),
  ]);

  const rendaMensal = receitas.reduce(
    (total, receita) =>
      total +
      calcularValorMensal(
        converterParaNumero(receita.valor),
        receita.frequencia,
        receita.data_recebimento
      ),
    0
  );

  const despesasMensais = despesas.reduce(
    (total, despesa) =>
      total +
      calcularValorMensal(
        converterParaNumero(despesa.valor),
        despesa.frequencia,
        despesa.data_vencimento
      ),
    0
  );

  const dividasMensais = dividas.reduce(
    (total, divida) =>
      total + converterParaNumero(divida.valor_parcela),
    0
  );

  const reservaFinanceira = converterParaNumero(
    reserva?.valor_atual
  );

  const saldoMensal =
    rendaMensal - despesasMensais - dividasMensais;

  const imprevisto = dados.imprevisto;

  const prompt = `
Você é o assistente financeiro do Finnitus.

Ajude o usuário a lidar com um imprevisto de forma prática,
responsável e personalizada.

SITUAÇÃO FINANCEIRA
- Renda mensal estimada: R$ ${rendaMensal.toFixed(2)}
- Despesas mensais estimadas: R$ ${despesasMensais.toFixed(2)}
- Parcelas mensais de dívidas: R$ ${dividasMensais.toFixed(2)}
- Reserva financeira disponível: R$ ${reservaFinanceira.toFixed(2)}
- Saldo mensal estimado após despesas e dívidas: R$ ${saldoMensal.toFixed(2)}

IMPREVISTO INFORMADO
- Nome: ${imprevisto.Inome}
- Tipo: ${imprevisto.tipo}
- Valor: R$ ${imprevisto.Ivalor.toFixed(2)}
- Data: ${imprevisto.Idata}
- Duração estimada: ${
    imprevisto.duracao_meses
      ? `${imprevisto.duracao_meses} mês(es)`
      : "Não informada"
  }
- Solução já escolhida: ${imprevisto.solucao_escolhida || "Nenhuma"}
- Descrição: ${imprevisto.Idescricao || "Não informada"}

ORIENTAÇÕES
1. Explique o impacto do imprevisto no orçamento.
2. Sugira ações práticas e priorize despesas essenciais.
3. Considere a reserva antes de recomendar empréstimos.
4. Não recomende crédito caro sem avaliar alternativas.
5. Não invente dados sobre o usuário.
6. Se o saldo mensal for negativo, considere isso nas sugestões.
7. Diferencie estimativas de valores confirmados.
8. Não julgue o usuário.

Organize a resposta em: análise da situação, sugestões práticas
e prioridades imediatas. Use linguagem clara e objetiva.
`;

  const resposta = await gerarRespostaGemini(prompt);

  // Registra o imprevisto após a análise ser gerada com sucesso.
  const imprevistoSalvo = await prisma.imprevisto.create({
    data: {
      id_Usuario,
      Inome: imprevisto.Inome,
      tipo: imprevisto.tipo,
      Ivalor: imprevisto.Ivalor,
      Idata: new Date(imprevisto.Idata),
      duracao_meses: imprevisto.duracao_meses ?? null,
      solucao_escolhida: imprevisto.solucao_escolhida ?? null,
      Idescricao: imprevisto.Idescricao ?? null,
    },
  });

  return {
    situacaoFinanceira: {
      rendaMensal: Number(rendaMensal.toFixed(2)),
      despesasMensais: Number(despesasMensais.toFixed(2)),
      dividasMensais: Number(dividasMensais.toFixed(2)),
      reservaFinanceira: Number(reservaFinanceira.toFixed(2)),
      saldoMensal: Number(saldoMensal.toFixed(2)),
    },
    imprevisto: imprevistoSalvo,
    resposta,
  };
}
