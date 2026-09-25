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

  onPress?: () => void;
}