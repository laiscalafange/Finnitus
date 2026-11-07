import type { ReactNode } from "react";

export interface ButtonProps {
  titulo: string;
  disabled?: boolean;
  icone?: ReactNode;

  variante?:
    | "primario"
    | "outline"
    | "secundario"
    | "terciario"
    | "botaotexto"
    | "perigo";

  // "compacto": botão mais baixo e arredondado, no mesmo estilo dos botões
  // dos modais do Calendário e de Editar meta. Padrão: "padrao" (como sempre foi)
  tamanho?: "padrao" | "compacto";

  onPress?: () => void;
}