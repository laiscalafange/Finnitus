// Dados da tela "Rotas de gastos" e dos cards "Gastos atuais" / "Recomendado"
// da seção Rotas do Plano-B.
//
// Tudo é calculado a partir das transações que a pessoa registra no
// "Novo gasto" (guardadas no FinanceiroProvider). Não existe mais mock aqui.
// TODO (backend): quando existir endpoint de transações, só trocar a origem da
// lista `transacoes` no FinanceiroProvider; essas contas continuam iguais.

import {
  CATEGORIAS_GASTO,
  CATEGORIAS_POR_ID,
} from "@/features/menuMais/constants";
import { formatarMoeda } from "@/features/menuMais/utils";
import type { Transacao } from "@/features/financeiroContext";
import type { RotaCategoria } from "@/shared/components/PlanoB/RotasCard";
import { Cores } from "@/shared/constants/Cores";

export const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Cor de cada categoria nos gráficos e nos ícones do Plano-B.
// Mesmo id das categorias do Novo gasto (src/features/menuMais/constants.ts)
export const COR_ROTA: Record<string, string> = {
  alimentacao: Cores.estado.perigo,
  lazer: "#A357FF",
  contas: Cores.destaque.amarelo,
  outros: Cores.destaque.limao,
  transporte: "#4DA6FF",
  saude: "#FF6FB5",
};

// Quanto da renda do mês é o ideal gastar em cada categoria.
// Regra 50/30/20: 50% necessidades (contas, alimentação, transporte, saúde),
// 30% desejos (lazer e outros) e 20% guardados.
// TODO (backend): trocar por uma regra personalizada pra cada pessoa.
export const PERCENTUAL_IDEAL: Record<string, number> = {
  contas: 0.22,
  alimentacao: 0.15,
  transporte: 0.08,
  saude: 0.05,
  lazer: 0.2,
  outros: 0.1,
};

// Dica de como reduzir quando a categoria passou do ideal
const DICA_ACIMA: Record<string, string> = {
  alimentacao: "Planeje as refeições da semana e reduza os pedidos por aplicativo.",
  transporte: "Compare rotas e combine trajetos para gastar menos com deslocamento.",
  lazer: "Escolha 1 ou 2 programas fixos por semana e prefira opções gratuitas.",
  contas: "Revise assinaturas e serviços que você quase não usa.",
  saude: "Compare preços de farmácia e use a rede pública quando possível.",
  outros: "Veja quais compras do mês não eram necessárias e corte as maiores.",
};

// acima = passou do ideal | dentro = abaixo do ideal | limite = igual ao ideal
export type StatusRota = "acima" | "dentro" | "limite";

export interface RotaGasto {
  categoriaId: string;
  cor: string;
  // Quanto a pessoa já gastou no mês nessa categoria
  atual: number;
  // Limite ideal da categoria no mês (0 enquanto não há renda)
  ideal: number;
  // Quanto ela deveria gastar: o ideal, ou o próprio gasto se já está abaixo
  recomendado: number;
  // atual - ideal (positivo = passou do ideal, negativo = sobrou)
  diferenca: number;
  // diferença em % em relação ao ideal (ex.: 33 = 33% acima)
  variacao: number;
  status: StatusRota;
  dica: string;
}

export interface ResumoRotas {
  nomeMes: string;
  ano: number;
  // true = ainda não dá pra calcular o ideal (nenhuma entrada nem salário)
  semRenda: boolean;
  // false = nenhum gasto registrado no mês
  temGastos: boolean;
  // Só as categorias com gasto no mês, da maior pra menor
  rotas: RotaGasto[];
  totalAtual: number;
  // Quanto dá pra economizar reduzindo só o que passou do ideal
  economia: number;
  totalComPlano: number;
  // % que o plano economiza em relação ao gasto de hoje
  percentual: number;
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

// Categorias extras do "Outros" (Mercado, Pets...) e as criadas pela pessoa
// entram juntas no card "Outros"
function idDaRota(categoriaId: string): string {
  return CATEGORIAS_GASTO.some((categoria) => categoria.id === categoriaId)
    ? categoriaId
    : "outros";
}

// A transação vale no mês? Se for "repetir mensalmente", vale em todo mês
// a partir do mês dela.
function transacaoContaNoMes(
  transacao: Transacao,
  mes: number,
  ano: number
): boolean {
  const [, mesTransacao, anoTransacao] = transacao.data.split("/").map(Number);

  if (transacao.repetirMensalmente) {
    return anoTransacao * 12 + mesTransacao <= ano * 12 + mes;
  }

  return anoTransacao === ano && mesTransacao === mes;
}

function dicaDaRota(categoriaId: string, status: StatusRota): string {
  if (status === "acima") {
    return DICA_ACIMA[categoriaId] ?? DICA_ACIMA.outros;
  }

  if (status === "dentro") {
    return "Você gastou menos que o ideal. Mantenha esse ritmo!";
  }

  return "Você está no limite do ideal. Qualquer gasto a mais passa do recomendado.";
}

// Calcula as rotas do mês atual com as transações registradas no Novo gasto.
// A renda do mês é a soma das entradas; se não houver, usa o salário
// informado na configuração inicial.
export function calcularRotas(
  transacoes: Transacao[],
  salario?: number,
  hoje: Date = new Date()
): ResumoRotas {
  const mes = hoje.getMonth() + 1;
  const ano = hoje.getFullYear();

  // Soma em centavos pra não errar por arredondamento
  const gastosPorCategoria: Record<string, number> = {};
  let entradasCentavos = 0;

  for (const transacao of transacoes) {
    if (!transacaoContaNoMes(transacao, mes, ano)) {
      continue;
    }

    const centavos = Math.round(transacao.valor * 100);

    if (transacao.tipo === "entrada") {
      entradasCentavos += centavos;
      continue;
    }

    const id = idDaRota(transacao.categoriaId);
    gastosPorCategoria[id] = (gastosPorCategoria[id] ?? 0) + centavos;
  }

  const entradas = entradasCentavos / 100;
  const renda = entradas > 0 ? entradas : salario && salario > 0 ? salario : 0;
  const semRenda = renda <= 0;

  const rotas: RotaGasto[] = Object.entries(gastosPorCategoria)
    .filter(([, centavos]) => centavos > 0)
    .map(([categoriaId, centavos]) => {
      const atual = centavos / 100;
      const ideal = semRenda
        ? 0
        : arredondar(renda * (PERCENTUAL_IDEAL[categoriaId] ?? 0));
      const diferenca = semRenda ? 0 : arredondar(atual - ideal);

      // "|| 0" evita aparecer "-0%" quando o gasto é igual ao ideal
      const variacao =
        ideal > 0 ? Math.round((diferenca / ideal) * 100) || 0 : 0;

      const status: StatusRota =
        diferenca > 0 ? "acima" : diferenca < 0 ? "dentro" : "limite";

      return {
        categoriaId,
        cor: COR_ROTA[categoriaId] ?? COR_ROTA.outros,
        atual,
        ideal,
        recomendado: semRenda ? atual : Math.min(atual, ideal),
        diferenca,
        variacao,
        status,
        dica: semRenda ? "" : dicaDaRota(categoriaId, status),
      };
    })
    .sort((a, b) => b.atual - a.atual);

  const totalAtual = arredondar(
    rotas.reduce((soma, rota) => soma + rota.atual, 0)
  );

  // O plano reduz só as categorias que passaram do ideal
  const economia = arredondar(
    rotas.reduce((soma, rota) => soma + Math.max(rota.diferenca, 0), 0)
  );

  return {
    nomeMes: NOMES_MESES[mes - 1],
    ano,
    semRenda,
    temGastos: rotas.length > 0,
    rotas,
    totalAtual,
    economia,
    totalComPlano: arredondar(totalAtual - economia),
    percentual: totalAtual > 0 ? Math.round((economia / totalAtual) * 100) : 0,
  };
}

// Dados dos dois cards da seção Rotas do Plano-B
export interface CardRotas {
  titulo: string;
  total: number;
  categorias: RotaCategoria[];
  sobra?: number;
  sobraTexto?: string;
  // Mensagem mostrada no lugar da lista quando não há o que mostrar
  vazio?: string;
}

function percentualDe(valor: number, total: number): number {
  return total > 0 ? Math.round((valor / total) * 100) : 0;
}

export function montarCardsRotas(resumo: ResumoRotas): {
  atuais: CardRotas;
  recomendado: CardRotas;
} {
  const semGastos = "Nenhum gasto neste mês. Registre em Novo gasto.";

  const atuais: CardRotas = {
    titulo: "Gastos atuais",
    total: resumo.totalAtual,
    categorias: resumo.rotas.map((rota) => ({
      categoriaId: rota.categoriaId,
      valor: rota.atual,
      percentual: percentualDe(rota.atual, resumo.totalAtual),
      cor: rota.cor,
      tendencia: resumo.semRenda
        ? undefined
        : rota.status === "acima"
          ? "up"
          : rota.status === "dentro"
            ? "down"
            : "stable",
    })),
    sobraTexto:
      resumo.economia > 0
        ? "Gastos podem ser reduzidos para maximizar lucro passivo"
        : undefined,
    vazio: resumo.temGastos ? undefined : semGastos,
  };

  const recomendado: CardRotas = {
    titulo: "Recomendado",
    total: resumo.semRenda ? 0 : resumo.totalComPlano,
    categorias: resumo.semRenda
      ? []
      : resumo.rotas.map((rota) => ({
          categoriaId: rota.categoriaId,
          valor: rota.recomendado,
          percentual: percentualDe(rota.recomendado, resumo.totalComPlano),
          cor: rota.cor,
          tendencia: rota.status === "acima" ? "down" : "stable",
        })),
    sobra: resumo.economia > 0 ? resumo.economia : undefined,
    sobraTexto:
      resumo.economia > 0
        ? "Valor pode ser utilizado em compras futuras"
        : undefined,
    vazio: !resumo.temGastos
      ? semGastos
      : resumo.semRenda
        ? "Registre uma entrada em Novo gasto para ver o valor recomendado."
        : undefined,
  };

  return { atuais, recomendado };
}

// Linhas do "Resumo" que aparece no final de cada versão da tela
export function linhasResumo(
  resumo: ResumoRotas,
  versao: "atuais" | "recomendado"
): string[] {
  return resumo.rotas.map((rota) => {
    const nome = (CATEGORIAS_POR_ID[rota.categoriaId] ?? CATEGORIAS_POR_ID.outros)
      .rotulo;

    // Sem renda não dá pra comparar com o ideal: mostra o peso no total
    if (resumo.semRenda) {
      return `• ${nome}: ${percentualDe(rota.atual, resumo.totalAtual)}% dos seus gastos`;
    }

    if (versao === "recomendado") {
      return rota.status === "acima"
        ? `• ${nome}: reduzir ${formatarMoeda(rota.diferenca)}`
        : `• ${nome}: pode manter`;
    }

    if (rota.status === "acima") {
      return rota.variacao >= 25
        ? `• ${nome} alto`
        : `• ${nome} acima do ideal`;
    }

    return rota.status === "limite"
      ? `• ${nome} no limite`
      : `• ${nome} controlado`;
  });
}