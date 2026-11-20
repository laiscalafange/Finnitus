export const Cores = {
  //Fundos
  fundo: {
    principal: '#0D1112',   // fundo das telas
    card: '#482287',        // fundo de cards
    cardAlt: '#49257b9c',     // NOVO - variante mais escura de card (dashboard, metas)
    destaque: '#7E3BED',    // destaque em fundos escuros
    navBarra: '#25074f',    // NOVO - fundo da Nav Bar
    navFab: '#260654',      // NOVO - fundo do botão central (FAB) da Nav Bar
    seta: '#863ff9',        // NOVO - fundo do botão de seta dos cabeçalhos
  },

  //Cores principais (marca)
  roxo: {
    principal: '#7c4dff',   // cor da marca
    claro: '#9b77ff',       // botões, interações
    escuro: '#5e24ff',      // fundos mais profundos
  },

  //Destaques (ações)
  destaque: {
    positivo: '#6BC300',    // sucesso
    limao: '#B7FF00',       // CTA (chamar atenção)
    amarelo: '#E8FF1B',     // atenção / premium
  },

  //Estados do sistema
  estado: {
    alerta: '#FFCC01',      // aviso
    perigo: '#FF8800',      // erro / ação perigosa
    sucesso: '#22C55E',     // confirmação
    erro: '#EF4444',        // erro forte
    desabilitado: '#210d2f' // elemento desativado
  },

  //Textos
  texto: {
    principal: '#CA9FFF',   // texto principal
    secundario: '#9A5DFF',  // labels
    claro: '#C7A9F5',       // NOVO - texto lilás claro sobre fundo escuro (substitui ~8 tons quase idênticos)
    contraste: '#3B176B',   // NOVO - texto roxo escuro sobre fundo claro/limão
    desabilitado: '#3B2A5F' // texto inativo
  },

  // Sobreposições (overlays translúcidos usados em cards/divisores)
  overlay: {
    suave: 'rgba(255,255,255,0.10)',
    medio: 'rgba(255,255,255,0.16)',
    forte: 'rgba(255,255,255,0.20)',
    intenso: 'rgba(255,255,255,0.35)',
    cardSuave: 'rgba(72,34,135,0.15)',
    cardForte: 'rgba(72,34,135,0.45)',
  },

  //Extras de interface
  interface: {
    borda: '#2A2A2A',               // bordas
    divisor: '#1F1F1F',             // linhas separadoras
    overlay: 'rgba(18, 2, 47, 0.5)',     // fundo de modal (estava com bug: '#rgb(...)' não é uma cor válida)
  },

  // Base
  base: {
    branco: '#FFFFFF',
    preto: '#000000',
    cinza: '#231a27',
  }
} as const;

//como usar:

/* import { Cores } from "@/shared/constants/Cores";

<View style={{ backgroundColor: Cores.fundo.principal }} />

<Text style={{ color: Cores.texto.principal }} />

<Button style={{ backgroundColor: Cores.roxo.principal }} /> */