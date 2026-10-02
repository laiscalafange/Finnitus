// Dados dos planos de assinatura (Básico, Mega finn, Infinitos).
// Usado pela tela Premium (carrossel) e pelas telas de Pagamento e
// "Você é Premium agora!", pra todas mostrarem os mesmos nomes e preços.

export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  periodo?: string;
  // Texto do teste grátis mostrado no card (ex.: "7 dias de teste grátis!")
  teste?: string;
  // Quantidade de dias do teste grátis (usada pra calcular a data da 1ª cobrança)
  testeDias?: number;
  badge?: string;
  beneficios: string[];
}

// TODO (backend): trocar por dados vindos da API quando existir cobrança real
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
    testeDias: 7,
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

// Plano que abre por padrão no Pagamento quando a rota chega sem plano válido
export const PLANO_PADRAO_ID = "mega-finn";

// Procura um plano pelo id. Se não achar (ou for o Básico, que é grátis e
// não tem pagamento), devolve o plano padrão (Mega finn).
export function buscarPlanoPago(id?: string): Plano {
  const padrao = PLANOS.find((plano) => plano.id === PLANO_PADRAO_ID) as Plano;
  const encontrado = PLANOS.find((plano) => plano.id === id);

  if (!encontrado || encontrado.id === "basico") {
    return padrao;
  }

  return encontrado;
}