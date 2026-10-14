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
// Mantidas a partir do classificador que você já tinha.
// ======================================================

const palavrasDespesa: PalavraFinanceira[] = [
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
  { termo: "conta a pagar", peso: 4 },
  { termo: "pagar conta", peso: 4 },
  { termo: "pagar boleto", peso: 4 },
  { termo: "pagar fatura", peso: 4 },
  { termo: "pagar aluguel", peso: 4 },
  { termo: "pagar salario", peso: 4 },
  { termo: "folha de pagamento", peso: 4 },
  { termo: "pix", peso: 2 },
  { termo: "fazer pix", peso: 3 },
  { termo: "enviar pix", peso: 3 },
  { termo: "transferencia", peso: 2 },
  { termo: "transferir", peso: 2 },
  { termo: "enviar dinheiro", peso: 3 },
  { termo: "mandar dinheiro", peso: 3 },
  { termo: "aluguel", peso: 2 },
  { termo: "condominio", peso: 2 },
  { termo: "prestacao", peso: 3 },
  { termo: "financiamento", peso: 3 },
  { termo: "financiamento casa", peso: 3 },
  { termo: "financiamento carro", peso: 3 },
  { termo: "imovel", peso: 1 },
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
  { termo: "faculdade", peso: 2 },
  { termo: "escola", peso: 2 },
  { termo: "curso", peso: 2 },
  { termo: "mensalidade faculdade", peso: 3 },
  { termo: "mensalidade escola", peso: 3 },
  { termo: "matricula", peso: 3 },
  { termo: "material escolar", peso: 2 },
  { termo: "apostila", peso: 2 },
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
  { termo: "mercado", peso: 2 },
  { termo: "supermercado", peso: 2 },
  { termo: "compras do mes", peso: 3 },
  { termo: "restaurante", peso: 2 },
  { termo: "lanche", peso: 2 },
  { termo: "almoco", peso: 2 },
  { termo: "jantar", peso: 2 },
  { termo: "ifood", peso: 2 },
  { termo: "delivery", peso: 2 },
  { termo: "academia", peso: 2 },
  { termo: "cinema", peso: 2 },
  { termo: "ingresso", peso: 2 },
  { termo: "hotel", peso: 2 },
  { termo: "hospedagem", peso: 2 },
  { termo: "roupa", peso: 2 },
  { termo: "sapato", peso: 2 },
  { termo: "shopping", peso: 1 },
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
// Mantidas a partir do classificador que você já tinha.
// ======================================================

const palavrasReceita: PalavraFinanceira[] = [
  { termo: "salario", peso: 3 },
  { termo: "salario recebido", peso: 4 },
  { termo: "receber salario", peso: 4 },
  { termo: "receber", peso: 3 },
  { termo: "recebimento", peso: 3 },
  { termo: "recebi", peso: 3 },
  { termo: "pagamento recebido", peso: 4 },
  { termo: "pagamento do trabalho", peso: 4 },
  { termo: "pix recebido", peso: 4 },
  { termo: "receber pix", peso: 4 },
  { termo: "recebi pix", peso: 4 },
  { termo: "transferencia recebida", peso: 4 },
  { termo: "receber transferencia", peso: 4 },
  { termo: "deposito", peso: 2 },
  { termo: "deposito recebido", peso: 4 },
  { termo: "freela", peso: 3 },
  { termo: "freelance", peso: 3 },
  { termo: "bico", peso: 2 },
  { termo: "comissao", peso: 3 },
  { termo: "bonus", peso: 3 },
  { termo: "gratificacao", peso: 3 },
  { termo: "hora extra", peso: 3 },
  { termo: "venda", peso: 3 },
  { termo: "vendi", peso: 3 },
  { termo: "vender", peso: 2 },
  { termo: "pagamento cliente", peso: 4 },
  { termo: "pagamento do cliente", peso: 4 },
  { termo: "cliente pagou", peso: 4 },
  { termo: "receber cliente", peso: 4 },
  { termo: "reembolso", peso: 3 },
  { termo: "reembolso recebido", peso: 4 },
  { termo: "estorno", peso: 3 },
  { termo: "devolucao", peso: 2 },
  { termo: "cashback", peso: 3 },
  { termo: "beneficio", peso: 2 },
  { termo: "bolsa", peso: 2 },
  { termo: "auxilio", peso: 2 },
  { termo: "vale", peso: 2 },
  { termo: "pensao", peso: 3 },
  { termo: "dividendo", peso: 3 },
  { termo: "dividendos", peso: 3 },
  { termo: "rendimento", peso: 3 },
  { termo: "rendimentos", peso: 3 },
  { termo: "juros recebidos", peso: 4 },
  { termo: "provento", peso: 3 },
  { termo: "proventos", peso: 3 },
  { termo: "premio", peso: 2 },
  { termo: "presente em dinheiro", peso: 4 },
  { termo: "dinheiro recebido", peso: 4 },
  { termo: "ganhei dinheiro", peso: 4 },
  { termo: "ganho", peso: 2 },
  { termo: "entrada de dinheiro", peso: 4 },
];

// ======================================================
// FERIADOS E DATAS COMEMORATIVAS DO BRASIL
//
// IMPORTANTE:
// Essas palavras NÃO viram automaticamente RECEITA ou
// DESPESA. Elas tornam o evento "SUSPEITO" para o app
// perguntar ao usuário se existe caráter financeiro.
//
// Assim, "Natal" ou "Dia das Crianças" pode gerar a
// pergunta, mas é o usuário quem confirma se houve gasto
// ou recebimento.
// ======================================================

const palavrasDatasComemorativas: PalavraFinanceira[] = [
  { termo: "feriado", peso: 2 },
  { termo: "feriado nacional", peso: 2 },
  { termo: "feriado estadual", peso: 2 },
  { termo: "feriado municipal", peso: 2 },
  { termo: "ponto facultativo", peso: 2 },
  { termo: "recesso", peso: 2 },
  { termo: "ano novo", peso: 2 },
  { termo: "confraternizacao universal", peso: 2 },
  { termo: "vespera de ano novo", peso: 2 },
  { termo: "carnaval", peso: 2 },
  { termo: "segunda de carnaval", peso: 2 },
  { termo: "terca de carnaval", peso: 2 },
  { termo: "quarta feira de cinzas", peso: 2 },
  { termo: "paixao de cristo", peso: 2 },
  { termo: "sexta feira santa", peso: 2 },
  { termo: "semana santa", peso: 2 },
  { termo: "pascoa", peso: 2 },
  { termo: "domingo de pascoa", peso: 2 },
  { termo: "tiradentes", peso: 2 },
  { termo: "dia do trabalho", peso: 2 },
  { termo: "dia mundial do trabalho", peso: 2 },
  { termo: "corpus christi", peso: 2 },
  { termo: "independencia do brasil", peso: 2 },
  { termo: "sete de setembro", peso: 2 },
  { termo: "nossa senhora aparecida", peso: 2 },
  { termo: "padroeira do brasil", peso: 2 },
  { termo: "finados", peso: 2 },
  { termo: "proclamacao da republica", peso: 2 },
  { termo: "consciencia negra", peso: 2 },
  { termo: "dia da consciencia negra", peso: 2 },
  { termo: "dia nacional de zumbi", peso: 2 },
  { termo: "dia nacional de zumbi e da consciencia negra", peso: 2 },
  { termo: "natal", peso: 2 },
  { termo: "vespera de natal", peso: 2 },
  { termo: "ceia de natal", peso: 2 },
  { termo: "dia do servidor publico", peso: 2 },
  { termo: "servidor publico", peso: 2 },
  { termo: "aniversario", peso: 2 },
  { termo: "dia das maes", peso: 2 },
  { termo: "dia dos pais", peso: 2 },
  { termo: "dia das criancas", peso: 2 },
  { termo: "dia da crianca", peso: 2 },
  { termo: "dia dos namorados", peso: 2 },
  { termo: "dia dos avos", peso: 2 },
  { termo: "dia da familia", peso: 2 },
  { termo: "dia do amigo", peso: 2 },
  { termo: "dia da amizade", peso: 2 },
  { termo: "dia do cliente", peso: 2 },
  { termo: "dia do consumidor", peso: 2 },
  { termo: "dia mundial do consumidor", peso: 2 },
  { termo: "black friday", peso: 2 },
  { termo: "cyber monday", peso: 2 },
  { termo: "volta as aulas", peso: 2 },
  { termo: "inicio das aulas", peso: 2 },
  { termo: "formatura", peso: 2 },
  { termo: "festa junina", peso: 2 },
  { termo: "festa julina", peso: 2 },
  { termo: "sao joao", peso: 2 },
  { termo: "dia de sao joao", peso: 2 },
  { termo: "santo antonio", peso: 2 },
  { termo: "dia de santo antonio", peso: 2 },
  { termo: "sao pedro", peso: 2 },
  { termo: "dia de sao pedro", peso: 2 },
  { termo: "dia de reis", peso: 2 },
  { termo: "epifania", peso: 2 },
  { termo: "pentecostes", peso: 2 },
  { termo: "dia de iemanja", peso: 2 },
  { termo: "nossa senhora da conceicao", peso: 2 },
  { termo: "nossa senhora de fatima", peso: 2 },
  { termo: "nossa senhora de lourdes", peso: 2 },
  { termo: "nossa senhora da penha", peso: 2 },
  { termo: "senhor do bonfim", peso: 2 },
  { termo: "sao jorge", peso: 2 },
  { termo: "dia de sao jorge", peso: 2 },
  { termo: "sao sebastiao", peso: 2 },
  { termo: "sao jose", peso: 2 },
  { termo: "sao francisco de assis", peso: 2 },
  { termo: "sao benedito", peso: 2 },
  { termo: "santa rita", peso: 2 },
  { termo: "dia internacional da mulher", peso: 2 },
  { termo: "dia da mulher", peso: 2 },
  { termo: "dia do estudante", peso: 2 },
  { termo: "dia do professor", peso: 2 },
  { termo: "dia dos professores", peso: 2 },
  { termo: "dia do medico", peso: 2 },
  { termo: "dia do dentista", peso: 2 },
  { termo: "dia do enfermeiro", peso: 2 },
  { termo: "dia da enfermagem", peso: 2 },
  { termo: "dia do advogado", peso: 2 },
  { termo: "dia do engenheiro", peso: 2 },
  { termo: "dia do contador", peso: 2 },
  { termo: "dia da secretaria", peso: 2 },
  { termo: "dia do trabalhador", peso: 2 },
  { termo: "dia do idoso", peso: 2 },
  { termo: "dia da pessoa idosa", peso: 2 },
  { termo: "dia da juventude", peso: 2 },
  { termo: "dia do adolescente", peso: 2 },
  { termo: "dia da arvore", peso: 2 },
  { termo: "dia do meio ambiente", peso: 2 },
  { termo: "dia mundial do meio ambiente", peso: 2 },
  { termo: "dia da agua", peso: 2 },
  { termo: "dia da terra", peso: 2 },
  { termo: "dia da bandeira", peso: 2 },
  { termo: "descobrimento do brasil", peso: 2 },
  { termo: "dia da republica", peso: 2 },
  { termo: "dia dos povos indigenas", peso: 2 },
  { termo: "dia do indio", peso: 2 },
  { termo: "dia da amazonia", peso: 2 },
  { termo: "dia do folclore", peso: 2 },
  { termo: "dia do samba", peso: 2 },
  { termo: "dia da musica", peso: 2 },
  { termo: "dia do livro", peso: 2 },
  { termo: "dia nacional do livro", peso: 2 },
  { termo: "dia da patria", peso: 2 },
  { termo: "dia do comercio", peso: 2 },
  { termo: "dia do comerciario", peso: 2 },
  { termo: "dia do bancario", peso: 2 },
  { termo: "dia do motorista", peso: 2 },
  { termo: "dia do agricultor", peso: 2 },
  { termo: "dia do turismo", peso: 2 },
  { termo: "dia do empreendedor", peso: 2 },
  { termo: "dia do mei", peso: 2 },
  { termo: "dia do microempreendedor individual", peso: 2 },
  { termo: "aniversario da cidade", peso: 2 },
  { termo: "aniversario do municipio", peso: 2 },
  { termo: "aniversario do estado", peso: 2 },
  { termo: "emancipacao politica", peso: 2 },
  { termo: "emancipacao do municipio", peso: 2 },
  { termo: "emancipacao municipal", peso: 2 },
  { termo: "data magna", peso: 2 },
  { termo: "criacao do estado", peso: 2 },
  { termo: "instalacao do estado", peso: 2 },
  { termo: "elevacao do estado", peso: 2 },
  { termo: "padroeiro da cidade", peso: 2 },
  { termo: "padroeira da cidade", peso: 2 },
  { termo: "padroeiro do municipio", peso: 2 },
  { termo: "padroeira do municipio", peso: 2 },
  { termo: "revolucao constitucionalista", peso: 2 },
  { termo: "revolucao de 1932", peso: 2 },
  { termo: "independencia da bahia", peso: 2 },
  { termo: "dois de julho", peso: 2 },
  { termo: "revolucao farroupilha", peso: 2 },
  { termo: "dia do gaucho", peso: 2 },
  { termo: "data magna de pernambuco", peso: 2 },
  { termo: "independencia de sergipe", peso: 2 },
  { termo: "dia do piaui", peso: 2 },
  { termo: "tratado de petropolis", peso: 2 },
  { termo: "revolucao acreana", peso: 2 },
  { termo: "elevacao do acre a categoria de estado", peso: 2 },
  { termo: "elevacao do amazonas a provincia", peso: 2 },
  { termo: "data magna do amapa", peso: 2 },
  { termo: "data magna da bahia", peso: 2 },
  { termo: "data magna do ceara", peso: 2 },
  { termo: "data magna do maranhao", peso: 2 },
  { termo: "data magna do para", peso: 2 },
  { termo: "data magna da paraiba", peso: 2 },
  { termo: "criacao de mato grosso do sul", peso: 2 },
  { termo: "protomartires", peso: 2 },
  { termo: "instalacao do estado de rondonia", peso: 2 },
  { termo: "criacao de roraima", peso: 2 },
  { termo: "carta magna de santa catarina", peso: 2 },
  { termo: "criacao do tocantins", peso: 2 },
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
// Ex.: "conta" não será encontrada dentro de "contato".
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
// Reconhece:
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
    Number(valorNormalizado);

  if (Number.isNaN(valor)) {
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

  const receitasEncontradas =
    palavrasReceita.filter(
      ({ termo }) =>
        contemPalavraOuExpressao(
          texto,
          termo
        )
    );

  const despesasEncontradas =
    palavrasDespesa.filter(
      ({ termo }) =>
        contemPalavraOuExpressao(
          texto,
          termo
        )
    );

  const datasComemorativasEncontradas =
    palavrasDatasComemorativas.filter(
      ({ termo }) =>
        contemPalavraOuExpressao(
          texto,
          termo
        )
    );

  const pontosReceita =
    receitasEncontradas.reduce(
      (total, palavra) =>
        total + palavra.peso,
      0
    );

  const pontosDespesa =
    despesasEncontradas.reduce(
      (total, palavra) =>
        total + palavra.peso,
      0
    );

  const pontosDatasComemorativas =
    datasComemorativasEncontradas.reduce(
      (total, palavra) =>
        total + palavra.peso,
      0
    );

  const valorDetectado =
    detectarValor(titulo);

  const pontosValor =
    valorDetectado !== undefined
      ? 3
      : 0;

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

  datasComemorativasEncontradas.forEach(
    ({ termo, peso }) => {
      motivos.push(
        `Feriado/data comemorativa detectada: ${termo} (+${peso})`
      );
    }
  );

  if (valorDetectado !== undefined) {
    motivos.push(
      `Valor encontrado: R$ ${valorDetectado.toFixed(
        2
      )} (+3)`
    );
  }

  const maiorPontuacao =
    Math.max(
      pontosReceita,
      pontosDespesa
    );

  const pontuacaoFinanceira =
    maiorPontuacao +
    pontosDatasComemorativas +
    pontosValor;

  const PONTUACAO_MINIMA = 2;

  if (
    pontuacaoFinanceira <
    PONTUACAO_MINIMA
  ) {
    return {
      status: "NAO_FINANCEIRO",
      motivos: [],
    };
  }

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

  return {
    status: "SUSPEITO",
    tipoProvavel,
    valorDetectado,
    motivos,
  };
}
