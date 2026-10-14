export type TipoFinanceiroProvavel =
  | "RECEITA"
  | "DESPESA";

export type ClassificacaoFinanceira = {
  status:
    | "SUSPEITO"
    | "NAO_FINANCEIRO";

  tipoProvavel?: TipoFinanceiroProvavel;

  valorDetectado?: number;

  motivos: string[];
};

type PalavraFinanceira = {
  termo: string;
  peso: number;
};

// ======================================================
// PALAVRAS RELACIONADAS A DESPESAS
// ======================================================

const palavrasDespesa: PalavraFinanceira[] = [
  // ====================================================
  // TERMOS FORTES
  // Peso 3 = forte indício financeiro
  // ====================================================

  { termo: "pagar", peso: 3 },
  { termo: "pagamento", peso: 3 },
  { termo: "paguei", peso: 3 },
  { termo: "boleto", peso: 3 },
  { termo: "fatura", peso: 3 },
  { termo: "vencimento", peso: 3 },
  { termo: "vencer", peso: 3 },
  { termo: "parcela", peso: 3 },
  { termo: "parcelamento", peso: 3 },
  { termo: "cobranca", peso: 3 },
  { termo: "cobrar", peso: 3 },
  { termo: "despesa", peso: 3 },
  { termo: "gasto", peso: 3 },
  { termo: "gastar", peso: 3 },
  { termo: "compra", peso: 3 },
  { termo: "comprar", peso: 3 },

  // Frases mais específicas
  { termo: "conta a pagar", peso: 4 },
  { termo: "pagar conta", peso: 4 },
  { termo: "pagar boleto", peso: 4 },
  { termo: "pagar fatura", peso: 4 },
  { termo: "pagar aluguel", peso: 4 },
  { termo: "pagar salario", peso: 4 },
  { termo: "folha de pagamento", peso: 4 },

  // ====================================================
  // TRANSFERÊNCIAS
  // ====================================================

  { termo: "pix", peso: 2 },
  { termo: "fazer pix", peso: 3 },
  { termo: "enviar pix", peso: 3 },
  { termo: "transferencia", peso: 2 },
  { termo: "transferir", peso: 2 },
  { termo: "enviar dinheiro", peso: 3 },
  { termo: "mandar dinheiro", peso: 3 },

  // ====================================================
  // MORADIA
  // ====================================================

  { termo: "aluguel", peso: 2 },
  { termo: "condominio", peso: 2 },
  { termo: "prestacao", peso: 3 },
  { termo: "financiamento", peso: 3 },
  { termo: "financiamento casa", peso: 3 },
  { termo: "financiamento carro", peso: 3 },
  { termo: "imovel", peso: 1 },

  // ====================================================
  // CONTAS DA CASA
  // ====================================================

  { termo: "conta de luz", peso: 3 },
  { termo: "conta de agua", peso: 3 },
  { termo: "conta de gas", peso: 3 },
  { termo: "conta de internet", peso: 3 },
  { termo: "conta de telefone", peso: 3 },

  { termo: "energia", peso: 2 },
  { termo: "luz", peso: 2 },
  { termo: "agua", peso: 2 },
  { termo: "gas", peso: 2 },
  { termo: "internet", peso: 2 },
  { termo: "wifi", peso: 2 },
  { termo: "telefone", peso: 2 },
  { termo: "celular", peso: 2 },

  // ====================================================
  // ASSINATURAS
  // ====================================================

  { termo: "mensalidade", peso: 3 },
  { termo: "assinatura", peso: 3 },
  { termo: "streaming", peso: 2 },

  { termo: "netflix", peso: 2 },
  { termo: "spotify", peso: 2 },
  { termo: "amazon prime", peso: 2 },
  { termo: "prime video", peso: 2 },
  { termo: "youtube premium", peso: 2 },
  { termo: "disney plus", peso: 2 },
  { termo: "disney+", peso: 2 },
  { termo: "hbo", peso: 2 },
  { termo: "max", peso: 2 },

  // ====================================================
  // EDUCAÇÃO
  // ====================================================

  { termo: "faculdade", peso: 2 },
  { termo: "escola", peso: 2 },
  { termo: "curso", peso: 2 },
  { termo: "mensalidade faculdade", peso: 3 },
  { termo: "mensalidade escola", peso: 3 },
  { termo: "matricula", peso: 3 },
  { termo: "material escolar", peso: 2 },
  { termo: "apostila", peso: 2 },

  // ====================================================
  // SAÚDE
  // ====================================================

  { termo: "consulta", peso: 2 },
  { termo: "consulta medica", peso: 2 },
  { termo: "medico", peso: 2 },
  { termo: "dentista", peso: 2 },
  { termo: "farmacia", peso: 2 },
  { termo: "remedio", peso: 2 },
  { termo: "medicamento", peso: 2 },
  { termo: "exame", peso: 2 },
  { termo: "terapia", peso: 2 },
  { termo: "psicologo", peso: 2 },
  { termo: "plano de saude", peso: 3 },

  // ====================================================
  // TRANSPORTE
  // ====================================================

  { termo: "combustivel", peso: 2 },
  { termo: "gasolina", peso: 2 },
  { termo: "alcool", peso: 2 },
  { termo: "etanol", peso: 2 },
  { termo: "abastecer", peso: 2 },
  { termo: "abastecimento", peso: 2 },
  { termo: "posto", peso: 1 },

  { termo: "uber", peso: 2 },
  { termo: "99", peso: 2 },
  { termo: "onibus", peso: 2 },
  { termo: "metro", peso: 2 },
  { termo: "passagem", peso: 2 },
  { termo: "pedagio", peso: 2 },
  { termo: "estacionamento", peso: 2 },

  // ====================================================
  // VEÍCULO
  // ====================================================

  { termo: "prestacao carro", peso: 3 },
  { termo: "parcela carro", peso: 3 },
  { termo: "seguro carro", peso: 3 },
  { termo: "seguro", peso: 2 },
  { termo: "ipva", peso: 3 },
  { termo: "licenciamento", peso: 3 },
  { termo: "manutencao", peso: 2 },
  { termo: "mecanico", peso: 2 },
  { termo: "oficina", peso: 2 },
  { termo: "revisao carro", peso: 2 },
  { termo: "revisao moto", peso: 2 },

  // ====================================================
  // ALIMENTAÇÃO
  // ====================================================

  { termo: "mercado", peso: 2 },
  { termo: "supermercado", peso: 2 },
  { termo: "compras do mes", peso: 3 },
  { termo: "restaurante", peso: 2 },
  { termo: "lanche", peso: 2 },
  { termo: "almoco", peso: 2 },
  { termo: "jantar", peso: 2 },
  { termo: "ifood", peso: 2 },
  { termo: "delivery", peso: 2 },

  // ====================================================
  // LAZER / PESSOAL
  // ====================================================

  { termo: "academia", peso: 2 },
  { termo: "cinema", peso: 2 },
  { termo: "ingresso", peso: 2 },
  { termo: "hotel", peso: 2 },
  { termo: "hospedagem", peso: 2 },
  { termo: "roupa", peso: 2 },
  { termo: "sapato", peso: 2 },
  { termo: "shopping", peso: 1 },

  // ====================================================
  // EVENTOS / PRESENTES
  // Palavras fracas porque podem existir sem dinheiro
  // ====================================================

  { termo: "aniversario", peso: 1 },
  { termo: "presente", peso: 1 },
  { termo: "casamento", peso: 1 },
  { termo: "festa", peso: 1 },
  { termo: "viagem", peso: 1 },

  { termo: "comprar presente", peso: 3 },
  { termo: "presente aniversario", peso: 2 },
  { termo: "presente de aniversario", peso: 2 },

  { termo: "doacao", peso: 2 },
  { termo: "doar", peso: 2 },

  // ====================================================
  // IMPOSTOS / TAXAS
  // ====================================================

  { termo: "imposto", peso: 3 },
  { termo: "taxa", peso: 2 },
  { termo: "multa", peso: 3 },
  { termo: "juros", peso: 2 },
  { termo: "tarifa", peso: 3 },
  { termo: "tarifa bancaria", peso: 3 },
  { termo: "anuidade", peso: 3 },
];

// ======================================================
// PALAVRAS RELACIONADAS A RECEITAS
// ======================================================

const palavrasReceita: PalavraFinanceira[] = [
  // ====================================================
  // TRABALHO / SALÁRIO
  // ====================================================

  { termo: "salario", peso: 3 },
  { termo: "salario recebido", peso: 4 },
  { termo: "receber salario", peso: 4 },

  { termo: "receber", peso: 3 },
  { termo: "recebimento", peso: 3 },
  { termo: "recebi", peso: 3 },

  { termo: "pagamento recebido", peso: 4 },
  { termo: "pagamento do trabalho", peso: 4 },

  // ====================================================
  // TRANSFERÊNCIAS RECEBIDAS
  // ====================================================

  { termo: "pix recebido", peso: 4 },
  { termo: "receber pix", peso: 4 },
  { termo: "recebi pix", peso: 4 },

  { termo: "transferencia recebida", peso: 4 },
  { termo: "receber transferencia", peso: 4 },

  { termo: "deposito", peso: 2 },
  { termo: "deposito recebido", peso: 4 },

  // ====================================================
  // TRABALHO EXTRA
  // ====================================================

  { termo: "freela", peso: 3 },
  { termo: "freelance", peso: 3 },
  { termo: "bico", peso: 2 },
  { termo: "comissao", peso: 3 },
  { termo: "bonus", peso: 3 },
  { termo: "gratificacao", peso: 3 },
  { termo: "hora extra", peso: 3 },

  // ====================================================
  // VENDAS
  // ====================================================

  { termo: "venda", peso: 3 },
  { termo: "vendi", peso: 3 },
  { termo: "vender", peso: 2 },

  { termo: "pagamento cliente", peso: 4 },
  { termo: "pagamento do cliente", peso: 4 },
  { termo: "cliente pagou", peso: 4 },
  { termo: "receber cliente", peso: 4 },

  // ====================================================
  // REEMBOLSOS / DEVOLUÇÕES
  // ====================================================

  { termo: "reembolso", peso: 3 },
  { termo: "reembolso recebido", peso: 4 },
  { termo: "estorno", peso: 3 },
  { termo: "devolucao", peso: 2 },
  { termo: "cashback", peso: 3 },

  // ====================================================
  // BENEFÍCIOS
  // ====================================================

  { termo: "beneficio", peso: 2 },
  { termo: "bolsa", peso: 2 },
  { termo: "auxilio", peso: 2 },
  { termo: "vale", peso: 2 },
  { termo: "pensao", peso: 3 },

  // ====================================================
  // INVESTIMENTOS
  // ====================================================

  { termo: "dividendo", peso: 3 },
  { termo: "dividendos", peso: 3 },
  { termo: "rendimento", peso: 3 },
  { termo: "rendimentos", peso: 3 },

  { termo: "juros recebidos", peso: 4 },

  { termo: "provento", peso: 3 },
  { termo: "proventos", peso: 3 },

  // ====================================================
  // OUTRAS RECEITAS
  // ====================================================

  { termo: "premio", peso: 2 },

  { termo: "presente em dinheiro", peso: 4 },
  { termo: "dinheiro recebido", peso: 4 },

  { termo: "ganhei dinheiro", peso: 4 },
  { termo: "ganho", peso: 2 },
  { termo: "entrada de dinheiro", peso: 4 },
];

// ======================================================
// NORMALIZAÇÃO
// ======================================================

function normalizarTexto(
  texto: string
): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}

// ======================================================
// PROTEÇÃO CONTRA FALSOS POSITIVOS
//
// Exemplo:
// "conta" não será encontrada dentro de "contato"
// ======================================================

function escaparRegex(
  texto: string
): string {
  return texto.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

function contemPalavraOuExpressao(
  texto: string,
  palavra: string
): boolean {
  const textoNormalizado =
    normalizarTexto(texto);

  const termoNormalizado =
    normalizarTexto(palavra);

  const termoEscapado =
    escaparRegex(
      termoNormalizado
    ).replace(
      /\s+/g,
      "\\s+"
    );

  const regex = new RegExp(
    `(^|[^a-z0-9])${termoEscapado}(?=$|[^a-z0-9])`,
    "i"
  );

  return regex.test(
    textoNormalizado
  );
}

// ======================================================
// DETECÇÃO DE VALORES
//
// Exemplos reconhecidos:
// R$ 100
// R$100
// R$ 1.500,90
// 100 reais
// 50 real
// ======================================================

function detectarValor(
  texto: string
): number | undefined {
  const regexReal =
    /R\$\s*([\d.]+(?:,\d{1,2})?)/i;

  const regexReais =
    /([\d.]+(?:,\d{1,2})?)\s*(?:real|reais)\b/i;

  const resultado =
    texto.match(regexReal) ??
    texto.match(regexReais);

  if (!resultado?.[1]) {
    return undefined;
  }

  const valorNormalizado =
    resultado[1]
      .replace(/\./g, "")
      .replace(",", ".");

  const valor =
    Number(
      valorNormalizado
    );

  if (
    Number.isNaN(valor)
  ) {
    return undefined;
  }

  return valor;
}

// ======================================================
// CLASSIFICAÇÃO DO EVENTO
// ======================================================

export function classificarEventoFinanceiro(
  titulo: string
): ClassificacaoFinanceira {
  const texto =
    normalizarTexto(titulo);

  const motivos: string[] = [];

  // ----------------------------------------------------
  // Procura TODAS as palavras de receita
  // ----------------------------------------------------

  const receitasEncontradas =
    palavrasReceita.filter(
      ({ termo }) =>
        contemPalavraOuExpressao(
          texto,
          termo
        )
    );

  // ----------------------------------------------------
  // Procura TODAS as palavras de despesa
  // ----------------------------------------------------

  const despesasEncontradas =
    palavrasDespesa.filter(
      ({ termo }) =>
        contemPalavraOuExpressao(
          texto,
          termo
        )
    );

  // ----------------------------------------------------
  // Soma os pesos
  // ----------------------------------------------------

  const pontosReceita =
    receitasEncontradas.reduce(
      (
        total,
        palavra
      ) =>
        total +
        palavra.peso,
      0
    );

  const pontosDespesa =
    despesasEncontradas.reduce(
      (
        total,
        palavra
      ) =>
        total +
        palavra.peso,
      0
    );

  // ----------------------------------------------------
  // Detecta valor monetário
  // ----------------------------------------------------

  const valorDetectado =
    detectarValor(titulo);

  const pontosValor =
    valorDetectado !== undefined
      ? 3
      : 0;

  // ----------------------------------------------------
  // Adiciona os motivos
  // ----------------------------------------------------

  receitasEncontradas.forEach(
    ({ termo, peso }) => {
      motivos.push(
        `Indício de receita: ${termo} (+${peso})`
      );
    }
  );

  despesasEncontradas.forEach(
    ({ termo, peso }) => {
      motivos.push(
        `Indício de despesa: ${termo} (+${peso})`
      );
    }
  );

  if (
    valorDetectado !== undefined
  ) {
    motivos.push(
      `Valor encontrado: R$ ${valorDetectado.toFixed(
        2
      )} (+3)`
    );
  }

  // ----------------------------------------------------
  // Calcula a força do indício financeiro
  //
  // Usa a categoria com maior pontuação
  // + pontuação do valor encontrado.
  // ----------------------------------------------------

  const maiorPontuacao =
    Math.max(
      pontosReceita,
      pontosDespesa
    );

  const pontuacaoFinanceira =
    maiorPontuacao +
    pontosValor;

  // ----------------------------------------------------
  // PRECISA DE PELO MENOS 2 PONTOS
  //
  // Isso evita casos como:
  //
  // "Aniversário Julia"
  //
  // aniversário = 1
  // portanto NÃO pergunta nada.
  //
  // Mas:
  //
  // "Aniversário Julia R$ 100"
  //
  // aniversário = 1
  // valor = 3
  // total = 4
  //
  // portanto será considerado suspeito.
  // ----------------------------------------------------

  const PONTUACAO_MINIMA = 2;

  if (
    pontuacaoFinanceira <
    PONTUACAO_MINIMA
  ) {
    return {
      status:
        "NAO_FINANCEIRO",
      motivos: [],
    };
  }

  // ----------------------------------------------------
  // Decide se parece RECEITA ou DESPESA
  // ----------------------------------------------------

  let tipoProvavel:
    | TipoFinanceiroProvavel
    | undefined;

  if (
    pontosReceita >
    pontosDespesa
  ) {
    tipoProvavel =
      "RECEITA";
  } else if (
    pontosDespesa >
    pontosReceita
  ) {
    tipoProvavel =
      "DESPESA";
  }

  // Se empatar, deixa undefined.
  // Nesse caso o sistema pode simplesmente
  // perguntar ao usuário se é receita ou despesa.

  return {
    status: "SUSPEITO",
    tipoProvavel,
    valorDetectado,
    motivos,
  };
}