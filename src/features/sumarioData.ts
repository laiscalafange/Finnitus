// Dados da tela "Sumário detalhado" (aberta pelo card Sumário do Dashboard
// e do Plano-B).
// TODO (backend): trocar por dados vindos da API.

export interface GastoCategoria {
  // Mesmo id das categorias do Novo gasto (src/features/menuMais/constants.ts)
  categoriaId: string;
  valor: number;
  cor: string;
}

export const SUMARIO_DETALHADO_MOCK = {
  mes: "Setembro",
  ano: 2026,

  // Totais do mês (os dois cards do topo)
  gastos: 3000,
  economias: 1300,

  // Gastos dos últimos 6 meses (gráfico de área), do mais antigo ao mais novo
  ultimosMeses: [
    { mes: "Abr", valor: 2700 },
    { mes: "Mai", valor: 2900 },
    { mes: "Jun", valor: 2500 },
    { mes: "Jul", valor: 2800 },
    { mes: "Ago", valor: 3100 },
    { mes: "Set", valor: 3000 },
  ],

  // Gastos por categoria (a barra mostra a fatia de cada uma no total de gastos)
  categorias: [
    { categoriaId: "alimentacao", valor: 1200, cor: "#FF8800" },
    { categoriaId: "transporte", valor: 420, cor: "#9b77ff" },
    { categoriaId: "lazer", valor: 680, cor: "#7E3BED" },
    { categoriaId: "contas", valor: 850, cor: "#C7A9F5" },
  ] as GastoCategoria[],
};