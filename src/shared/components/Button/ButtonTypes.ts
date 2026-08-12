export interface ButtonProps {
  titulo: string;
  variante?: "primario" | "outline" | "secundario" | "terciario";
  onPress?: () => void;
}