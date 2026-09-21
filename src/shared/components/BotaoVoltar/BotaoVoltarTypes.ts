export interface BotaoVoltarProps {
  // Ação customizada. Se não for passada, volta pra tela anterior
  aoPress?: () => void;
  // Cor da seta (padrão: roxo escuro)
  cor?: string;
  // Tamanho da seta em px
  tamanho?: number;
}