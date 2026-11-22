/** Planos conceituais do TCC: nenhuma oferta comercial ou cobrança. */
export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  periodo?: string;
  teste?: string;
  badge?: string;
  beneficios: string[];
}

export const PLANOS: Plano[] = [
  {
    id: "basico",
    nome: "Básico",
    descricao: "Para quem está começando a organizar as finanças",
    preco: "Grátis",
    beneficios: [
      "Controle de gastos",
      "Até 3 metas ativas",
      "Relatório mensal simples",
    ],
  },
  {
    id: "mega-finn",
    nome: "Mega finn",
    badge: "Mais popular",
    descricao: "Para quem deseja ter controle sobre o próprio futuro",
    preco: "R$15,95",
    periodo: "/mês",
    teste: "7 dias de teste grátis!",
    beneficios: [
      "Tudo do Básico",
      "Metas ilimitadas",
      "Plano-B completo (simulação de imprevistos)",
      "Calendário inteligente de contas e vencimentos",
      "Relatórios e gráficos avançados",
    ],
  },
  {
    id: "infinitos",
    nome: "Infinitos",
    descricao: "Para quem quer o máximo de recursos e liberdade",
    preco: "R$29,90",
    periodo: "/mês",
    beneficios: [
      "Tudo do Mega Finn",
      "Consultoria financeira mensal",
      "Metas compartilhadas em família",
      "Suporte prioritário",
    ],
  },
];

export const PLANO_PADRAO_ID = "mega-finn";

export function buscarPlanoPago(id?: string): Plano {
  return PLANOS.find((plano) => plano.id === id) ?? PLANOS[1];
}
