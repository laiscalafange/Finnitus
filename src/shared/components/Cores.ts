export const Cores = {
  //Fundos
  fundo: {
    principal: '#0D1112',   // fundo das telas
    card: '#482287',        // fundo de cards
    destaque: '#7E3BED',    // destaque em fundos escuros
  },

  //Cores principais (marca)
  roxo: {
    principal: '#53269D',   // cor da marca
    claro: '#A357FF',       // botões, interações
    escuro: '#240E47',      // fundos mais profundos
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
    desabilitado: '#3B2A5F' // texto inativo
  },

  //Extras de interface
  interface: {
    borda: '#2A2A2A',               // bordas
    divisor: '#1F1F1F',             // linhas separadoras
    overlay: '#rgb(18, 2, 47,0.5)',     // fundo de modal
  },

  // Base
  base: {
    branco: '#FFFFFF',
    preto: '#000000',
     Cinza: '#231a27',
  }
} as const;

//como usar:

/* import { Cores } from "@/shared/theme/cores";

<View style={{ backgroundColor: Cores.fundo.principal }} />

<Text style={{ color: Cores.texto.principal }} />

<Button style={{ backgroundColor: Cores.roxo.principal }} /> */