import { gerarRespostaGemini } from "./gemini.service.js";

interface DadosPlanoB {
  renda: number;
  despesas: number;
  dividas: number;
  reserva: number;

  imprevisto: {
    tipo: string;
    valor: number;
    duracao_meses?: number;
    descricao?: string;
  };
}

export async function analisarPlanoB(dados: DadosPlanoB) {
  const saldoMensal = dados.renda - dados.despesas - dados.dividas;

  const prompt = `
Você é o assistente financeiro do Finnitus.

Sua função é ajudar o usuário a lidar com um imprevisto financeiro
de forma prática, responsável e personalizada.

Analise os seguintes dados:

SITUAÇÃO FINANCEIRA
- Renda mensal: R$ ${dados.renda.toFixed(2)}
- Despesas mensais: R$ ${dados.despesas.toFixed(2)}
- Dívidas/parcelas mensais: R$ ${dados.dividas.toFixed(2)}
- Reserva financeira: R$ ${dados.reserva.toFixed(2)}
- Saldo mensal estimado: R$ ${saldoMensal.toFixed(2)}

IMPREVISTO
- Tipo: ${dados.imprevisto.tipo}
- Valor: R$ ${dados.imprevisto.valor.toFixed(2)}
- Duração estimada: ${
    dados.imprevisto.duracao_meses
      ? `${dados.imprevisto.duracao_meses} mês(es)`
      : "Não informada"
  }
- Descrição: ${dados.imprevisto.descricao || "Não informada"}

Com base nesses dados:

1. Explique brevemente como o imprevisto afeta a situação financeira.
2. Dê sugestões práticas para lidar com o imprevisto.
3. Considere a reserva financeira antes de recomendar novas dívidas.
4. Priorize despesas essenciais.
5. Evite recomendar crédito caro, como cheque especial ou rotativo do cartão.
6. Se houver possibilidade de parcelamento, avalie se a parcela cabe no saldo mensal.
7. Não invente informações que não foram fornecidas.
8. Não faça julgamentos sobre o usuário.

Responda de forma clara, curta e prática.
`;

  const resposta = await gerarRespostaGemini(prompt);

  return {
    saldoMensal,
    resposta,
  };
}