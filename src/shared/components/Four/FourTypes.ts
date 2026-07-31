export interface FourProps {
  tamanho?: number;
  onCodigoCompleto: (codigo: string) => void;
  erro?: boolean;
}