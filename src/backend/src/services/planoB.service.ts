

import { prisma } from "../lib/prisma.js";
import { gerarRespostaGemini } from "./gemini.service.js";


type Frequencia =
  | "UNICA"
  | "SEMANAL"
  | "QUINZENAL"
  | "MENSAL"
  | "ANUAL";


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


interface EstrategiaGemini {
  titulo: string;
  descricao: string;
  justificativa: string;
  riscos: string[];
  vantagens: string[];
}


interface RespostaGemini {
  analise: string;
  prioridades: string[];
  estrategias: EstrategiaGemini[];
}


function converterParaNumero(valor: unknown): number {
  return Number(valor ?? 0);
}


function arredondar(valor: number): number {
  return Number(valor.toFixed(2));
}


function mesmoMes(data: Date, referencia: Date): boolean {
  return (
    data.getFullYear() === referencia.getFullYear() &&
    data.getMonth() === referencia.getMonth()
  );
}


// Converte valores recorrentes para uma média mensal.
function calcularValorMensal(
  valor: number,
  frequencia: Frequencia,
  data: Date,
  referencia: Date
): number {
  switch (frequencia) {
    case "SEMANAL":
      return (valor * 52) / 12;


    case "QUINZENAL":
      return (valor * 26) / 12;


    case "MENSAL":
      return valor;


    case "ANUAL":
      return valor / 12;


    case "UNICA":
      return mesmoMes(data, referencia) ? valor : 0;


    default:
      return 0;
  }
}


// Extrai e valida a estrutura JSON devolvida pelo Gemini.
function interpretarRespostaGemini(
  texto: string
): RespostaGemini | null {
  try {
    const textoLimpo = texto
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();


    const inicio = textoLimpo.indexOf("{");
    const fim = textoLimpo.lastIndexOf("}");


    if (inicio === -1 || fim === -1) {
      return null;
    }


    const objeto = JSON.parse(
      textoLimpo.substring(inicio, fim + 1)
    );


    if (
      typeof objeto.analise !== "string" ||
      !Array.isArray(objeto.prioridades) ||
      !Array.isArray(objeto.estrategias)
    ) {
      return null;
    }


    const estrategias = objeto.estrategias.filter(
      (item: unknown): item is EstrategiaGemini => {
        if (!item || typeof item !== "object") {
          return false;
        }


        const estrategia = item as Record<string, unknown>;


        return (
          typeof estrategia.titulo === "string" &&
          typeof estrategia.descricao === "string" &&
          typeof estrategia.justificativa === "string" &&
          Array.isArray(estrategia.riscos) &&
          Array.isArray(estrategia.vantagens) &&
          estrategia.riscos.every(
            (valor) => typeof valor === "string"
          ) &&
          estrategia.vantagens.every(
            (valor) => typeof valor === "string"
          )
        );
      }
    );


    return {
      analise: objeto.analise,
      prioridades: objeto.prioridades.filter(
        (item: unknown): item is string =>
          typeof item === "string"
      ),
      estrategias,
    };
  } catch {
    return null;
  }
}


export async function analisarPlanoB(
  id_Usuario: number,
  dados: DadosPlanoB
) {
  const hoje = new Date();


  const inicioMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    1
  );


  const fimMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );


  // Consulta os registros financeiros do usuário autenticado.
  const [
    receitas,
    despesas,
    dividas,
    reserva,
    metas,
  ] = await Promise.all([
    prisma.receita.findMany({
      where: {
        id_Usuario,
        status: {
          in: ["RECEBIDA", "PENDENTE"],
        },
      },
      select: {
        descricao: true,
        valor: true,
        frequencia: true,
        data_recebimento: true,
        status: true,
      },
    }),


    prisma.despesa.findMany({
      where: {
        id_Usuario,
        status: {
          in: ["PAGA", "PENDENTE"],
        },
      },
      select: {
        descricao: true,
        valor: true,
        frequencia: true,
        data_vencimento: true,
        data_pagamento: true,
        status: true,
      },
    }),


    prisma.divida.findMany({
      where: {
        id_Usuario,
        status: {
          in: ["ATIVA", "ATRASADA"],
        },
        parcelas_restantes: {
          gt: 0,
        },
        data_vencimento: {
          lte: fimMes,
        },
      },
      select: {
        nome: true,
        valor_parcela: true,
        parcelas_restantes: true,
        data_vencimento: true,
        status: true,
      },
    }),


    prisma.reservaFinanceira.findUnique({
      where: {
        id_Usuario,
      },
      select: {
        valor_atual: true,
        valor_desejado: true,
      },
    }),


    prisma.meta.findMany({
      where: {
        id_Usuario,
        Mstatus: "EM_ANDAMENTO",
        Mconfigurada: true,
      },
      select: {
        Mnome: true,
        Mvalor_objetivo: true,
        Mvalor_atual: true,
        Mvalor_periodo: true,
        Mprazo: true,
        Mprioridade: true,
      },
    }),
  ]);


  // 1. RECEITAS


  const receitasRecebidas = receitas.filter(
    (receita) => receita.status === "RECEBIDA"
  );


  const receitasPendentes = receitas.filter(
    (receita) => receita.status === "PENDENTE"
  );


  const rendaMensal = receitasRecebidas.reduce(
    (total, receita) =>
      total +
      calcularValorMensal(
        converterParaNumero(receita.valor),
        receita.frequencia,
        receita.data_recebimento,
        hoje
      ),
    0
  );


  const rendaPendenteMensal = receitasPendentes.reduce(
    (total, receita) =>
      total +
      calcularValorMensal(
        converterParaNumero(receita.valor),
        receita.frequencia,
        receita.data_recebimento,
        hoje
      ),
    0
  );


  // 2. DESPESAS


  const despesasPagas = despesas.filter(
    (despesa) => despesa.status === "PAGA"
  );


  const despesasPendentes = despesas.filter(
    (despesa) => despesa.status === "PENDENTE"
  );


  const calcularDespesas = (
    lista: typeof despesas
  ): number => {
    return lista.reduce((total, despesa) => {
      const dataReferencia =
        despesa.status === "PAGA" && despesa.data_pagamento
          ? despesa.data_pagamento
          : despesa.data_vencimento;


      return (
        total +
        calcularValorMensal(
          converterParaNumero(despesa.valor),
          despesa.frequencia,
          dataReferencia,
          hoje
        )
      );
    }, 0);
  };


  const despesasPagasMensais =
    calcularDespesas(despesasPagas);


  const despesasPendentesMensais =
    calcularDespesas(despesasPendentes);


  const despesasMensais =
    despesasPagasMensais + despesasPendentesMensais;


  // 3. DÍVIDAS


  const dividasMensais = dividas.reduce(
    (total, divida) =>
      total + converterParaNumero(divida.valor_parcela),
    0
  );


  // 4. RESERVA FINANCEIRA


  const reservaFinanceira = converterParaNumero(
    reserva?.valor_atual
  );


  const valorDesejadoReserva = converterParaNumero(
    reserva?.valor_desejado
  );


  // 5. METAS


  const depositosMensaisMetas = metas.reduce(
    (total, meta) =>
      total + converterParaNumero(meta.Mvalor_periodo),
    0
  );


  const metasParaAnalise = metas.map((meta) => ({
    nome: meta.Mnome,
    valorObjetivo: converterParaNumero(
      meta.Mvalor_objetivo
    ),
    valorAtual: converterParaNumero(
      meta.Mvalor_atual
    ),
    valorRestante: Math.max(
      0,
      converterParaNumero(meta.Mvalor_objetivo) -
        converterParaNumero(meta.Mvalor_atual)
    ),
    depositoMensal: converterParaNumero(
      meta.Mvalor_periodo
    ),
    prazo: meta.Mprazo
      ? meta.Mprazo.toLocaleDateString("pt-BR")
      : "Não definido",
    prioridade: meta.Mprioridade,
  }));


  // 6. SALDO E MARGEM FINANCEIRA


  const saldoMensal =
    rendaMensal -
    despesasMensais -
    dividasMensais;


  const margemFinanceira =
    saldoMensal - depositosMensaisMetas;


  // 7. SITUAÇÃO DO IMPREVISTO


  const imprevisto = dados.imprevisto;


  const valorImprevisto = imprevisto.Ivalor;


  const percentualReserva =
    reservaFinanceira > 0
      ? (valorImprevisto / reservaFinanceira) * 100
      : 0;


  const situacaoFinanceira = {
    rendaMensal: arredondar(rendaMensal),
    rendaPendenteMensal: arredondar(rendaPendenteMensal),


    despesasMensais: arredondar(despesasMensais),
    despesasPagasMensais: arredondar(despesasPagasMensais),
    despesasPendentesMensais: arredondar(
      despesasPendentesMensais
    ),


    dividasMensais: arredondar(dividasMensais),


    reservaFinanceira: arredondar(reservaFinanceira),
    valorDesejadoReserva: arredondar(
      valorDesejadoReserva
    ),


    depositosMensaisMetas: arredondar(
      depositosMensaisMetas
    ),


    saldoMensal: arredondar(saldoMensal),
    margemFinanceira: arredondar(margemFinanceira),


    valorImprevisto: arredondar(valorImprevisto),
    percentualReserva: arredondar(percentualReserva),
  };


  // 8. PROMPT PARA O GEMINI


  const prompt = `
Você é o assistente financeiro do Finnitus.


Sua responsabilidade é analisar a situação financeira do usuário
e recomendar estratégias práticas para lidar com um imprevisto.


Não julgue o usuário. Utilize linguagem simples, respeitosa e objetiva.


SITUAÇÃO FINANCEIRA


Renda mensal já recebida:
R$ ${rendaMensal.toFixed(2)}


Receitas pendentes:
R$ ${rendaPendenteMensal.toFixed(2)}


Despesas mensais totais:
R$ ${despesasMensais.toFixed(2)}


Despesas já pagas:
R$ ${despesasPagasMensais.toFixed(2)}


Despesas ainda pendentes:
R$ ${despesasPendentesMensais.toFixed(2)}


Parcelas de dívidas com vencimento até o fim do mês:
R$ ${dividasMensais.toFixed(2)}


Reserva financeira:
R$ ${reservaFinanceira.toFixed(2)}


Valor desejado para a reserva:
R$ ${valorDesejadoReserva.toFixed(2)}


Depósitos mensais planejados para metas:
R$ ${depositosMensaisMetas.toFixed(2)}


Saldo mensal após despesas e dívidas:
R$ ${saldoMensal.toFixed(2)}


Margem após os depósitos planejados:
R$ ${margemFinanceira.toFixed(2)}


METAS EM ANDAMENTO


${JSON.stringify(metasParaAnalise, null, 2)}


IMPREVISTO


Nome: ${imprevisto.Inome}
Tipo: ${imprevisto.tipo}
Valor: R$ ${valorImprevisto.toFixed(2)}
Data: ${imprevisto.Idata}
Duração: ${imprevisto.duracao_meses ?? "Não informada"} mês(es)
Solução escolhida anteriormente: ${
    imprevisto.solucao_escolhida || "Nenhuma"
  }
Descrição: ${imprevisto.Idescricao || "Não informada"}


REGRAS DA ANÁLISE


1. Utilize somente os dados fornecidos.
2. Não considere receitas pendentes como dinheiro disponível.
3. Diferencie despesas pagas das despesas ainda pendentes.
4. Não desconte despesas pagas novamente.
5. Considere as parcelas das dívidas.
6. Considere os depósitos planejados nas metas.
7. Avalie se é possível manter os depósitos das metas.
8. Não considere o dinheiro acumulado nas metas como disponível automaticamente.
9. A reserva pode ser considerada como alternativa, mas explique quanto restaria.
10. Não recomende empréstimos sem avaliar outras possibilidades.
11. Não invente valores, taxas, prazos ou condições.
12. Não recomende uma estratégia financeiramente impossível.
13. Se a margem for negativa, explique a situação.
14. Não trate a margem calculada como saldo bancário real.
15. Apresente alternativas coerentes com a situação específica do usuário.
16. Não recomende reduzir despesas essenciais sem avaliar consequências.
17. Não prometa que o usuário conseguirá atingir uma meta se os dados não permitirem essa conclusão.


ESTRATÉGIAS


As estratégias devem ser elaboradas por você, considerando o contexto.
Não utilize uma lista fixa de alternativas para todos os usuários.


Avalie, quando fizer sentido:
- Utilização parcial da reserva.
- Redução temporária de depósitos nas metas.
- Redução de despesas não essenciais.
- Parcelamento ou distribuição do impacto no tempo.
- Combinação de alternativas.
- Outras soluções adequadas ao tipo de imprevisto.


Se uma alternativa não for viável, não a recomende.


FORMATO OBRIGATÓRIO


Responda somente com JSON válido, sem markdown e sem texto fora do JSON.


Estrutura:


{
  "analise": "Explicação da situação financeira e do impacto do imprevisto.",
  "prioridades": [
    "Primeira prioridade",
    "Segunda prioridade"
  ],
  "estrategias": [
    {
      "titulo": "Nome da estratégia",
      "descricao": "Como funciona a alternativa.",
      "justificativa": "Por que faz sentido para esta situação.",
      "vantagens": [
        "Vantagem identificada"
      ],
      "riscos": [
        "Risco ou consequência"
      ]
    }
  ]
}


Apresente de duas a quatro estratégias quando existirem alternativas
viáveis. Não invente alternativas apenas para completar a quantidade.
`;


  const respostaBruta = await gerarRespostaGemini(prompt);

if (!respostaBruta || typeof respostaBruta !== "string") {
  throw new Error("O Gemini não retornou uma resposta válida.");
}

const respostaEstruturada =
  interpretarRespostaGemini(respostaBruta);

  // 9. SALVAR O IMPREVISTO


  const imprevistoSalvo = await prisma.imprevisto.create({
    data: {
      id_Usuario,
      Inome: imprevisto.Inome,
      tipo: imprevisto.tipo,
      Ivalor: imprevisto.Ivalor,
      Idata: new Date(imprevisto.Idata),
      duracao_meses: imprevisto.duracao_meses ?? null,
      solucao_escolhida:
        imprevisto.solucao_escolhida ?? null,
      Idescricao: imprevisto.Idescricao ?? null,
    },
  });


  // 10. RETORNO PARA O FRONTEND


  return {
    situacaoFinanceira,
    metas: metasParaAnalise,


    imprevisto: imprevistoSalvo,


    // Mantém uma resposta textual para compatibilidade
    // com a integração atual do frontend.
    resposta: respostaEstruturada
      ? respostaEstruturada.analise
      : respostaBruta,


    // Novos campos com as recomendações do Gemini.
    prioridades: respostaEstruturada?.prioridades ?? [],
    estrategias: respostaEstruturada?.estrategias ?? [],


    analiseEstruturada: Boolean(respostaEstruturada),
  };
}



