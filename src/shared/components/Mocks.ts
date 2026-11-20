import comidaIcon from '../../../assets/icones/comidas.png'
import roupasIcon from '../../../assets/icones/roupas.png'
import lazerIcon from '../../../assets/icones/lazer.png'
import contasIcon from '../../../assets/icones/contas.png'
import presenteIcon from '../../../assets/icones/presente.png'

import shellIcon from '../../../assets/icones/shell.png'
import rennerIcon from '../../../assets/icones/renner.png'
import transporteIcon from '../../../assets/icones/resgatado.png'
import pixIcon from '../../../assets/icones/gabriel.png'
// ============================================================
// MOCKS
// Dados temporários que futuramente serão substituídos
// pelas respostas da API.
// ============================================================


// ────────────────────────────────────────────────────────────
// SALDO / HEADER
// ────────────────────────────────────────────────────────────

export const SALDO_MOCK = {
  atual: 3590.76,
  maximoDisponivel: 7590.76,
  variacaoSemana: 19,
  variacaoMes: 12,
  data: '09/26',
}


// ────────────────────────────────────────────────────────────
// ESTATÍSTICAS
// ────────────────────────────────────────────────────────────

export const ESTATISTICAS_MOCK = {
  semanaAtual: [40, 65, 50, 80, 35, 60, 45],
  semanaPassada: [30, 50, 70, 40, 55, 45, 60],
}


// ────────────────────────────────────────────────────────────
// PLANO B
// ────────────────────────────────────────────────────────────
export const PLANOB_MOCK = {
  mes: 9,
  ano: 2026,
  limite: 7590.76,
  gastoAtual: 3590.76,
  restante: 4000.00,
  status: 'Média',
  variacao: 12,

  categorias: [
    {
      nome: 'Comida',
      valor: 194.67,
      porcentagem: 30,
      icone: comidaIcon,
      tipo: 'gasto',
      cor: '#B7FF00',
    },
    {
      nome: 'Roupas',
      valor: 89.90,
      porcentagem: 25,
      icone: roupasIcon,
      tipo: 'gasto',
      cor: '#FF8800',
    },
    {
      nome: 'Lazer',
      valor: 131.10,
      porcentagem: 25,
      icone: lazerIcon,
      tipo: 'gasto',
      cor: '#FF6B6B',
    },
    {
      nome: 'Contas',
      valor: 234.90,
      porcentagem: 20,
      icone: contasIcon,
      tipo: 'gasto',
      cor: '#A357FF',
    },
  ],
};

export const CATEGORIAS_PLANOB_MOCK =
  PLANOB_MOCK.categorias


// ────────────────────────────────────────────────────────────
// GRÁFICO DE ÁREA
// ────────────────────────────────────────────────────────────

export const DADOS_AREA_MOCK = [
  { x: 1, y: 300 },
  { x: 2, y: 450 },
  { x: 3, y: 380 },
  { x: 4, y: 520 },
  { x: 5, y: 410 },
  { x: 6, y: 490 },
  { x: 7, y: 356 },
]

export const DADOS_AREA_COMPARACAO_MOCK = [
  { x: 1, y: 250 },
  { x: 2, y: 330 },
  { x: 3, y: 310 },
  { x: 4, y: 430 },
  { x: 5, y: 390 },
  { x: 6, y: 420 },
  { x: 7, y: 280 },
]


// ────────────────────────────────────────────────────────────
// PERFORMANCE
// ────────────────────────────────────────────────────────────

export const PERFORMANCE_MOCK = {
  atual: {
    periodo: '09/26',
    label: 'Mês atual',
    status: 'Média',

    variacaoGastos: 19,
    gastos: 19,
    economias: 4.6,

    // Usado pela meia-lua
    porcentagem: 62,
    percentualGauge: 62,

    cor: '#FF8800',
  },

  anterior: {
    periodo: '08/26',
    label: 'Mês passado',
    status: 'Alta',

    variacaoGastos: -23.4,
    gastos: -10,
    economias: 13,

    // Usado pela meia-lua
    porcentagem: 78,
    percentualGauge: 78,

    cor: '#B7FF00',
  },
}


// ────────────────────────────────────────────────────────────
// GRÁFICOS DE PERFORMANCE
// ────────────────────────────────────────────────────────────

// Gráfico do mês atual

export const DADOS_PERFORMANCE_ATUAL_MOCK = [
  {
    x: 'Renda',
    y: 40,
  },
  {
    x: 'Gastos',
    y: 62,
  },
  {
    x: 'Economias',
    y: 30,
  },
]


// Gráfico do mês passado

export const DADOS_PERFORMANCE_ANTERIOR_MOCK = [
  {
    x: 'Renda',
    y: 65,
  },
  {
    x: 'Gastos',
    y: 78,
  },
  {
    x: 'Economias',
    y: 45,
  },
]


// ────────────────────────────────────────────────────────────
// SUMÁRIO DO PLANO B
// ────────────────────────────────────────────────────────────

export const SUMARIO_PLANOB_MOCK = {
  disponivel: 76.83,

  itens: [
    {
      label: 'Gastos',
      valor: 456.87,
      porcentagem: 65,
      cor: '#FF8800',
    },
    {
      label: 'Economias',
      valor: 76.83,
      porcentagem: 30,
      cor: '#B7FF00',
    },
    {
      label: 'Planos',
      valor: 2026.87,
      porcentagem: 80,
      cor: '#A357FF',
    },
  ],
}


// ============================================================
// DASHBOARD
// ============================================================

export const DASHBOARD_MOCK = {
  periodoInicial: '2026-02-10T12:00:00',

  estatisticas: {
    semanaAtual: [
      40,
      65,
      50,
      80,
      35,
      60,
      45,
    ],

    semanaPassada: [
      30,
      50,
      70,
      40,
      55,
      45,
      60,
    ],
  },

  sumario: {
    disponivel: 76.83,

    itens: [
      {
        label: 'Gastos',
        valor: 456.87,
        porcentagem: 65,
        cor: '#FF8800',
      },
      {
        label: 'Economias',
        valor: 76.83,
        porcentagem: 30,
        cor: '#B7FF00',
      },
      {
        label: 'Planos',
        valor: 2026.87,
        porcentagem: 80,
        cor: '#A357FF',
      },
    ],
  },

  atividade: {
    mes: 'Fevereiro',
    ano: 2026,

    dias: Array.from(
      { length: 20 },
      (_, i) => ({
        id: `atividade-${i + 1}`,
        nivel: (i * 7) % 10,
      }),
    ),
  },

  planejamentos: [
    {
      id: 'planejamento-1',
      nome: 'Presente',
      faltam: 20,
      valorAtual: 80,
      valorTotal: 100,
      icone: presenteIcon,
    },
  ],

  gastosSemana: {
    restante: 100,

    segmentos: [
      {
        cor: '#B7FF00',
        porcentagem: 50,
      },
      {
        cor: '#FF8800',
        porcentagem: 30,
      },
      {
        cor: '#A357FF',
        porcentagem: 20,
      },
    ],

    indicadores: [
      {
        id: 'renda',
        label: 'Renda da\núltima semana',
        valor: '↓ 4,6%',
        cor: '#B7FF00',
        
      },
      {
        id: 'gastos',
        label: 'Gastos da\núltima semana',
        valor: '↑ 19%',
        cor: '#FF8800',
      },
      {
        id: 'economias',
        label: 'Economias da\núltima semana',
        valor: '↓ 19%',
        cor: '#A357FF',
      },
    ],

    legenda: [
      {
        label: 'Renda',
        cor: '#B7FF00',
      },
      {
        label: 'Gastos',
        cor: '#FF8800',
      },
      {
        label: 'Economias',
        cor: '#A357FF',
      },
    ],
  },

  planoB: {
    mes: 'Mês',
    restante: 356.78,
    status: 'Média',
    categorias: CATEGORIAS_PLANOB_MOCK,
  },
}


// ────────────────────────────────────────────────────────────
// EVOLUÇÃO
// ────────────────────────────────────────────────────────────

export const DADOS_EVOLUCAO_MOCK = [
  { x: 1, y: 240 },
  { x: 2, y: 310 },
  { x: 3, y: 280 },
  { x: 4, y: 390 },
  { x: 5, y: 350 },
  { x: 6, y: 470 },
  { x: 7, y: 420 },
  { x: 8, y: 510 },
  { x: 9, y: 480 },
]


// ────────────────────────────────────────────────────────────
// ATIVIDADE / HEATMAP
// ────────────────────────────────────────────────────────────

// Cada objeto representa um dia.
//
// nivel aceita:
//
// 'alta'
// 'media'
// 'baixa'
// 'nenhuma'
//
// Futuramente a API pode retornar exatamente essa estrutura.

export const ATIVIDADE_HEATMAP_MOCK = {
  mes: 'Setembro',
  ano: 2026,

  dias: [
    {
      data: '2026-09-01',
      nivel: 'media',
    },
    {
      data: '2026-09-02',
      nivel: 'alta',
    },
    {
      data: '2026-09-03',
      nivel: 'baixa',
    },
    {
      data: '2026-09-04',
      nivel: 'nenhuma',
    },
    {
      data: '2026-09-05',
      nivel: 'alta',
    },
    {
      data: '2026-09-06',
      nivel: 'media',
    },
    {
      data: '2026-09-07',
      nivel: 'nenhuma',
    },
    {
      data: '2026-09-08',
      nivel: 'baixa',
    },
    {
      data: '2026-09-09',
      nivel: 'alta',
    },
    {
      data: '2026-09-10',
      nivel: 'media',
    },
    {
      data: '2026-09-11',
      nivel: 'nenhuma',
    },
    {
      data: '2026-09-12',
      nivel: 'alta',
    },
    {
      data: '2026-09-13',
      nivel: 'baixa',
    },
    {
      data: '2026-09-14',
      nivel: 'media',
    },
    {
      data: '2026-09-15',
      nivel: 'alta',
    },
    {
      data: '2026-09-16',
      nivel: 'nenhuma',
    },
    {
      data: '2026-09-17',
      nivel: 'media',
    },
    {
      data: '2026-09-18',
      nivel: 'baixa',
    },
    {
      data: '2026-09-19',
      nivel: 'alta',
    },
    {
      data: '2026-09-20',
      nivel: 'media',
    },
    {
      data: '2026-09-21',
      nivel: 'nenhuma',
    },
    {
      data: '2026-09-22',
      nivel: 'baixa',
    },
    {
      data: '2026-09-23',
      nivel: 'alta',
    },
    {
      data: '2026-09-24',
      nivel: 'media',
    },
    {
      data: '2026-09-25',
      nivel: 'alta',
    },
    {
      data: '2026-09-26',
      nivel: 'nenhuma',
    },
    {
      data: '2026-09-27',
      nivel: 'baixa',
    },
    {
      data: '2026-09-28',
      nivel: 'media',
    },
    {
      data: '2026-09-29',
      nivel: 'alta',
    },
    {
      data: '2026-09-30',
      nivel: 'nenhuma',
    },
  ],
}


// ────────────────────────────────────────────────────────────
// TRANSAÇÕES
// ────────────────────────────────────────────────────────────

export const TRANSACOES_MOCK = [
  {
    id: '1',
    nome: 'Shell',
    hora: '08:45',
    tipoTransacao: 'Pix',
    valor: 34.97,
    tipo: 'gasto',
    icone: shellIcon,
    data: '2026-09-01',
  },
  {
    id: '2',
    nome: 'Renner',
    hora: '12:56',
    tipoTransacao: 'Pix',
    valor: 89.99,
    tipo: 'gasto',
    icone: rennerIcon,
    data: '2026-09-03',
  },
  {
    id: '3',
    nome: 'Dinheiro resgatado',
    hora: '16:34',
    tipoTransacao: 'Resgate',
    valor: 50.00,
    tipo: 'entrada',
    icone: transporteIcon,
    data: '2026-09-05',
  },
  {
    id: '4',
    nome: 'Gabriel da Silva Neto',
    hora: '08:45',
    tipoTransacao: 'Pix',
    valor: 34.97,
    tipo: 'gasto',
    icone: pixIcon,
    data: '2026-09-08',
  },
]


// ────────────────────────────────────────────────────────────
// EVENTOS DO CALENDÁRIO
// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────
// CALENDÁRIO
// ────────────────────────────────────────────────────────────

export const CALENDARIO_MOCK = {
  mes: 9,
  ano: 2026,

  dias: [
    {
      data: '2026-09-01',
      temTransacao: true,
      temEvento: false,
      saldoDia: -34.97,
    },
    {
      data: '2026-09-03',
      temTransacao: true,
      temEvento: false,
      saldoDia: -89.99,
    },
    {
      data: '2026-09-05',
      temTransacao: true,
      temEvento: true,
      saldoDia: 15.03,
    },
    {
      data: '2026-09-08',
      temTransacao: true,
      temEvento: false,
      saldoDia: -34.97,
    },
    {
      data: '2026-09-12',
      temTransacao: false,
      temEvento: true,
      saldoDia: 0,
    },
    {
      data: '2026-09-15',
      temTransacao: false,
      temEvento: true,
      saldoDia: 3590.76,
    },
    {
      data: '2026-09-20',
      temTransacao: false,
      temEvento: true,
      saldoDia: 0,
    },
    {
      data: '2026-09-25',
      temTransacao: false,
      temEvento: true,
      saldoDia: -30,
    },
  ],
}


// ────────────────────────────────────────────────────────────
// CATEGORIAS DO MÊS
// ────────────────────────────────────────────────────────────

export const CATEGORIAS_MES_MOCK = [
  {
    nome: 'Alimentação',
    valor: 890,
    porcentagem: 36,
    cor: '#B7FF00',
  },
  {
    nome: 'Roupas',
    valor: 450,
    porcentagem: 18,
    cor: '#A357FF',
  },
  {
    nome: 'Transporte',
    valor: 380,
    porcentagem: 15,
    cor: '#E8FF1B',
  },
  {
    nome: 'Lazer',
    valor: 310,
    porcentagem: 13,
    cor: '#FF8800',
  },
  {
    nome: 'Outros',
    valor: 427,
    porcentagem: 18,
    cor: '#9A5DFF',
  },
]


// ────────────────────────────────────────────────────────────
// ROTAS DO PLANO B
// ────────────────────────────────────────────────────────────

export const ROTAS_PLANOB_MOCK = {
  gastosAtuais: {
    titulo: 'Gastos atuais',

    total: 871.50,

    categorias: [
      {
        nome: 'Lazer',
        valor: 325.50,
        percentual: 44,
        cor: '#A357FF',
        tendencia: 'up' as const,
      },
      {
        nome: 'Comida',
        valor: 213.90,
        percentual: 23,
        cor: '#FF8800',
        tendencia: 'down' as const,
      },
      {
        nome: 'Contas',
        valor: 112.10,
        percentual: 18,
        cor: '#E8FF1B',
        tendencia: 'up' as const,
      },
      {
        nome: 'Outros',
        valor: 200.89,
        percentual: 21,
        cor: '#B7FF00',
        tendencia: 'down' as const,
      },
    ],

    resumo: [
      '• Lazer alto',
      '• Comida moderada',
      '• Contas estáveis',
      '• Outros controlados',
    ],

    sobra: undefined,
sobraTexto: 'Gastos podem ser reduzidos para maximizar lucro passivo',
  },

  recomendado: {
    titulo: 'Recomendado',

    total: 548.90,

    categorias: [
      {
        nome: 'Lazer',
        valor: 245.50,
        percentual: 37,
        cor: '#A357FF',
        tendencia: 'down' as const,
      },
      {
        nome: 'Comida',
        valor: 153.90,
        percentual: 33,
        cor: '#FF8800',
        tendencia: 'down' as const,
      },
      {
        nome: 'Contas',
        valor: 80.90,
        percentual: 14,
        cor: '#E8FF1B',
        tendencia: 'down' as const,
      },
      {
        nome: 'Outros',
        valor: 78.90,
        percentual: 13,
        cor: '#B7FF00',
        tendencia: 'down' as const,
      },
    ],

    resumo: [
      '• Lazer controlado',
      '• Comida controlada',
      '• Contas controladas',
      '• Outros reduzidos',
    ],

   sobra: 302.11,
sobraTexto: 'Valor pode ser utilizado em compras futuras',
  },
}