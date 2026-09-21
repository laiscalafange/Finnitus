// Caminhos das telas que são abertas de vários lugares do app.
// Usar essas constantes evita o erro de digitar o caminho errado
// (foi isso que desconectou os botões de Premium e Notificação).
//
// Os arquivos ficam em src/app/Premium/Premium.tsx e
// src/app/Notificacao/Notificacao.tsx, então o caminho da rota
// é "pasta/arquivo" — "/Premium" sozinho não existe.

export const Rotas = {
  premium: '/Premium/Premium',
  notificacao: '/Notificacao/Notificacao',
  inicio: '/paginaInicial',
} as const;