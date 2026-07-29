export interface ButtonProps {
  titulo: string;
  variante?: "primario" | "outline";
  onPress?: () => void;
}