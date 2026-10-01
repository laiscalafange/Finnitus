import type { LucideIcon } from "lucide-react-native";

// Tipos das telas acessadas pelo botão "+" da barra de navegação

// Item de categoria mostrado na grade (ícone + nome)
export type CategoriaItem = {
  id: string;
  rotulo: string;
  icone: LucideIcon;
  // Só o card "Outros" tem: lista de categorias extras que abrem no modal
  extras?: CategoriaItem[];
};

// "Novo gasto" registra saídas (gasto) e entradas (receita)
export type TipoTransacao = "gasto" | "entrada";

// Uma movimentação (depósito ou retirada) da reserva de emergência
export type Movimentacao = {
  id: string;
  tipo: "deposito" | "retirada";
  valor: number;
  data: string; // DD/MM/AAAA
};

// A reserva de emergência do usuário (existe no máximo uma)
export type Reserva = {
  saldo: number;
  meta?: number;
  movimentacoes: Movimentacao[];
};

// Cards flutuantes da tela de Reserva de emergência
export type TipoModalReserva =
  | "criar"
  | "depositar"
  | "retirar"
  | "meta"
  | "saldoInsuficiente"
  | "excluir";