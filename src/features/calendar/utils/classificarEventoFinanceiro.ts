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

const palavrasDespesa = [
  "pagar",
  "pagamento",
  "vencimento",
  "boleto",
  "fatura",
  "parcela",
  "aluguel",
  "mensalidade",
  "assinatura",
  "conta",
  "aniversário",
  "presente",
  "doação",
  
];

const palavrasReceita = [
  "salario",
  "receber",
  "recebimento",
  "deposito",
  "reembolso",
];

function normalizarTexto(
  texto: string
): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );
}

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

export function classificarEventoFinanceiro(
  titulo: string
): ClassificacaoFinanceira {
  const texto =
    normalizarTexto(titulo);

  const motivos: string[] = [];

  const palavraReceita =
    palavrasReceita.find(
      (palavra) =>
        texto.includes(palavra)
    );

  const palavraDespesa =
    palavrasDespesa.find(
      (palavra) =>
        texto.includes(palavra)
    );

  const valorDetectado =
    detectarValor(titulo);

  if (palavraReceita) {
    motivos.push(
      `Palavra financeira encontrada: ${palavraReceita}`
    );
  }

  if (palavraDespesa) {
    motivos.push(
      `Palavra financeira encontrada: ${palavraDespesa}`
    );
  }

  if (
    valorDetectado !== undefined
  ) {
    motivos.push(
      `Valor encontrado: R$ ${valorDetectado.toFixed(
        2
      )}`
    );
  }

  if (
    !palavraReceita &&
    !palavraDespesa &&
    valorDetectado === undefined
  ) {
    return {
      status: "NAO_FINANCEIRO",
      motivos: [],
    };
  }

  let tipoProvavel:
    | TipoFinanceiroProvavel
    | undefined;

  if (palavraReceita) {
    tipoProvavel = "RECEITA";
  } else if (palavraDespesa) {
    tipoProvavel = "DESPESA";
  }

  return {
    status: "SUSPEITO",
    tipoProvavel,
    valorDetectado,
    motivos,
  };
}