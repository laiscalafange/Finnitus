export type TipoItemCalendario =
  | "RECEITA"
  | "DESPESA"
  | "META"
  | "DIVIDA"
  | "EVENTO";

export type ItemCalendario = {
  id: number;
  titulo: string;
  data: string;
  tipo: TipoItemCalendario;

  valor?: number;
  descricao?: string;

  horarioInicio?: string;
  horarioFim?: string;
  diaInteiro?: boolean;
};