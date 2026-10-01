import {
  Briefcase,
  Car,
  Dumbbell,
  Gamepad2,
  GraduationCap,
  Gift,
  House,
  Landmark,
  Laptop,
  Package,
  Pill,
  Plane,
  RotateCcw,
  Shirt,
  ShoppingCart,
  TrendingUp,
  Utensils,
  Wrench,
  Zap,
  PawPrint,
} from "lucide-react-native";

import type { CategoriaItem } from "./types";

// Categorias extras que abrem ao tocar em "Outros" (saídas)
const EXTRAS_GASTO: CategoriaItem[] = [
  { id: "mercado", rotulo: "Mercado", icone: ShoppingCart },
  { id: "educacao", rotulo: "Educação", icone: GraduationCap },
  { id: "moradia", rotulo: "Moradia", icone: House },
  { id: "vestuario", rotulo: "Vestuário", icone: Shirt },
  { id: "academia", rotulo: "Academia", icone: Dumbbell },
  { id: "pets", rotulo: "Pets", icone: PawPrint },
  { id: "viagem", rotulo: "Viagem", icone: Plane },
  { id: "manutencao", rotulo: "Manutenção", icone: Wrench },
  { id: "presentes", rotulo: "Presentes", icone: Gift },
];

// Categorias extras que abrem ao tocar em "Outros" (entradas)
const EXTRAS_ENTRADA: CategoriaItem[] = [
  { id: "vendas", rotulo: "Vendas", icone: ShoppingCart },
  { id: "aluguel", rotulo: "Aluguel recebido", icone: House },
  { id: "restituicao", rotulo: "Restituição", icone: Landmark },
  { id: "bonus", rotulo: "Bônus", icone: Gift },
];

// Categorias de saída (Novo gasto e Novo imprevisto), iguais às do protótipo
export const CATEGORIAS_GASTO: CategoriaItem[] = [
  { id: "alimentacao", rotulo: "Alimentação", icone: Utensils },
  { id: "transporte", rotulo: "Transporte", icone: Car },
  { id: "lazer", rotulo: "Lazer", icone: Gamepad2 },
  { id: "contas", rotulo: "Contas", icone: Zap },
  { id: "saude", rotulo: "Saúde", icone: Pill },
  { id: "outros", rotulo: "Outros", icone: Package, extras: EXTRAS_GASTO },
];

// Categorias de entrada (aparecem quando o alternador está em "Entrada").
// O id do "Outros" é diferente do de gasto pra as categorias criadas pela
// pessoa não se misturarem entre gasto e entrada.
export const CATEGORIAS_ENTRADA: CategoriaItem[] = [
  { id: "salario", rotulo: "Salário", icone: Briefcase },
  { id: "extra", rotulo: "Renda extra", icone: Laptop },
  { id: "rendimentos", rotulo: "Rendimentos", icone: TrendingUp },
  { id: "presente", rotulo: "Presente", icone: Gift },
  { id: "reembolso", rotulo: "Reembolso", icone: RotateCcw },
  {
    id: "outros-entrada",
    rotulo: "Outros",
    icone: Package,
    extras: EXTRAS_ENTRADA,
  },
];