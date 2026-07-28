export const GRADIENTS = {
  // header roxo das telas (Dashboard, Metas, etc)
  header: {
    colors: ['#A357FF', '#7E3BED' , '#8541F6'] as const,
    start: { x: 0, y: 0 },
    end:   { x: 0, y: 1 },
  },

  // fundo geral das telas (de cima pra baixo, quase preto)
  background: {
    colors: ['#2d0a47', '#0C0A14'] as const,
    start: { x: 0, y: 0 },
    end:   { x: 0, y: 1 },
  },

  // card verde / destaque
  premium: {
    colors: ['#E8FF1B', '#B7FF00'] as const,
    start: { x: 0, y: 0 },
    end:   { x: 1, y: 1 },
  },
} as const;