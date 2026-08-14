import { ReactNode } from "react";

export interface ButtonProps {
  titulo: string;
  icone?: ReactNode;
  variante?: "primario" | "outline";
  onPress?: () => void;
}