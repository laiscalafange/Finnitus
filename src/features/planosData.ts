import type { Href } from "expo-router";
import { Rotas } from "../shared/constants/Rotas";

type RecursoPlano = {
  nome: string;
  exemplo: string;
  destino?: { titulo: string; rota: Href };
};

/** Catálogo demonstrativo do Finnitus. */
export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  periodo?: string;
  teste?: string;
  badge?: string;
  beneficios: readonly string[];
  recursos: readonly RecursoPlano[];
}

const controleGastos: RecursoPlano = {
  nome: "Controle de gastos",
  exemplo: "Veja quanto gastou no mês e consulte os lançamentos por categoria.",
  destino: {
    titulo: "Abrir movimentações",
    rota: { pathname: Rotas.movimentacoes, params: { filtro: "gasto" } },
  },
};

const recursosBasico: readonly RecursoPlano[] = [
  controleGastos,
  {
    nome: "Até 3 metas ativas",
    exemplo: "Exemplo com 2 de 3 metas ativas: viagem e reserva de emergência.",
    destino: { titulo: "Abrir metas", rota: "/metas" },
  },
  {
    nome: "Relatório mensal simples",
    exemplo: "Exemplo do mês: R$ 2.450,00 recebidos, R$ 1.820,00 gastos e saldo de R$ 630,00.",
    destino: { titulo: "Abrir resumo financeiro", rota: Rotas.dashboard },
  },
];

const recursosMegaFinn: readonly RecursoPlano[] = [
  {
    nome: "Metas ilimitadas",
    exemplo: "Acompanhe juntas as metas para viagem, estudos, reserva e um novo computador.",
    destino: { titulo: "Abrir metas", rota: "/metas" },
  },
  {
    nome: "Plano B completo",
    exemplo: "Simule uma despesa inesperada de R$ 450,00 e veja como ela afeta seu mês.",
    destino: { titulo: "Abrir Plano B", rota: Rotas.planoB },
  },
  {
    nome: "Calendário inteligente de contas e vencimentos",
    exemplo: "Veja em uma agenda o recebimento do salário e as próximas contas a vencer.",
    destino: { titulo: "Abrir calendário", rota: "/calendario" },
  },
  {
    nome: "Relatórios e gráficos avançados",
    exemplo: "Compare seus gastos por categoria e acompanhe sua evolução mês a mês.",
    destino: { titulo: "Abrir dashboard", rota: Rotas.dashboard },
  },
];

const recursosInfinitus: readonly RecursoPlano[] = [
  {
    nome: "Consultoria financeira mensal",
    exemplo: "Exemplo de sessão: revisar o orçamento do mês e definir um valor para a reserva.",
  },
  {
    nome: "Metas compartilhadas em família",
    exemplo: "Exemplo de meta em família: viagem de R$ 6.000,00 com R$ 2.400,00 já guardados.",
  },
  {
    nome: "Suporte prioritário",
    exemplo: "Exemplo de solicitação: dúvida sobre um relatório, em análise pela equipe de suporte.",
  },
];

export const PLANOS: readonly Plano[] = [
  {
    id: "basico",
    nome: "Básico",
    descricao: "Para quem está começando a organizar as finanças",
    preco: "Grátis",
    beneficios: recursosBasico.map((recurso) => recurso.nome),
    recursos: recursosBasico,
  },
  {
    id: "mega-finn",
    nome: "Mega Finn",
    badge: "Mais popular",
    descricao: "Para quem deseja ter controle sobre o próprio futuro",
    preco: "R$15,95",
    periodo: "/mês",
    teste: "7 dias de teste grátis",
    beneficios: ["Tudo do Básico", ...recursosMegaFinn.map((recurso) => recurso.nome)],
    recursos: [controleGastos, ...recursosMegaFinn],
  },
  {
    id: "infinitos",
    nome: "Infinitus",
    descricao: "Para quem quer o máximo de recursos e liberdade",
    preco: "R$29,90",
    periodo: "/mês",
    beneficios: ["Tudo do Mega Finn", ...recursosInfinitus.map((recurso) => recurso.nome)],
    recursos: [controleGastos, ...recursosMegaFinn, ...recursosInfinitus],
  },
];

export const PLANO_PADRAO_ID = "mega-finn";
