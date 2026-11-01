/** Planos conceituais do TCC: nenhuma oferta comercial ou cobrança. */
export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  periodo?: string;
  badge?: string;
  beneficios: string[];
}

export const PLANOS: Plano[] = [
  {
    id: "basico",
    nome: "Básico",
    descricao: "Experiência de organização financeira apresentada no TCC.",
    preco: "Gratuito",
    beneficios: [
      "Registro de receitas e despesas",
      "Acompanhamento de metas financeiras",
      "Visualização de calendário financeiro",
    ],
  },
  {
    id: "mega-finn",
    nome: "Mega Finn",
    descricao: "Protótipo conceitual de uma possível modalidade futura.",
    preco: "Simulação — R$ 0,00",
    beneficios: [
      "Visualização demonstrativa de recursos do Finnitus",
      "Exploração do Plano B para simular imprevistos",
      "Nenhuma assinatura ou cobrança é criada",
    ],
  },
  {
    id: "infinitos",
    nome: "Infinitos",
    descricao: "Conceito de evolução futura, ainda não disponível comercialmente.",
    preco: "Simulação — R$ 0,00",
    beneficios: [
      "Conceito de funções futuras (não implementadas)",
      "Sem consultoria financeira profissional incluída",
      "Sem coleta de dados de pagamento",
    ],
  },
];

export const PLANO_PADRAO_ID = "mega-finn";
export function buscarPlanoPago(id?: string): Plano {
  return PLANOS.find((plano) => plano.id === id) ?? PLANOS[1];
}
