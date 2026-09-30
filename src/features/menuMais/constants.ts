import type { CategoriaItem } from "./types";

// Categorias de saída (Novo gasto e Novo imprevisto), iguais às do protótipo
export const CATEGORIAS_GASTO: CategoriaItem[] = [
  { id: "alimentacao", rotulo: "Alimentação", emoji: "🍔" },
  { id: "transporte", rotulo: "Transporte", emoji: "🚗" },
  { id: "lazer", rotulo: "Lazer", emoji: "🎮" },
  { id: "contas", rotulo: "Contas", emoji: "⚡" },
  { id: "saude", rotulo: "Saúde", emoji: "💊" },
  { id: "outros", rotulo: "Outros", emoji: "📦" },
];

// Categorias de entrada (aparecem quando o alternador está em "Entrada")
export const CATEGORIAS_ENTRADA: CategoriaItem[] = [
  { id: "salario", rotulo: "Salário", emoji: "💼" },
  { id: "extra", rotulo: "Renda extra", emoji: "💻" },
  { id: "rendimentos", rotulo: "Rendimentos", emoji: "📈" },
  { id: "presente", rotulo: "Presente", emoji: "🎁" },
  { id: "reembolso", rotulo: "Reembolso", emoji: "🔁" },
  { id: "outros", rotulo: "Outros", emoji: "📦" },
];