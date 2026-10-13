// Caminhos das telas que são abertas de vários lugares do app.
// Usar essas constantes evita o erro de digitar o caminho errado
// (foi isso que desconectou os botões de Premium e Notificação).

export const Rotas = {
  premium: '/Premium/Premium',
  pagamento: '/Premium/Pagamento',
  premiumAtivo: '/Premium/PremiumAtivo',
  notificacao: '/Notificacao/Notificacao',
  inicio: '/paginaInicial',
  inicie: '/inicie', 
  sumarioDetalhado: '/Detalhes/SumarioDetalhado',
  atividade: '/Detalhes/Atividade',
  rotasGastos: '/Detalhes/RotasGastos',
  contasFixas: '/Contas/ContasFixas',
  detalhesConta: '/Contas/DetalhesConta',
  confirmarConta: '/Contas/ConfirmarConta',
  editarConta: '/Contas/EditarConta',
  movimentacoes: '/Contas/Movimentacoes',
} as const;