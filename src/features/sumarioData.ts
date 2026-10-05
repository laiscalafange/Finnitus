// Dados do Sumário e da Atividade (cards do Plano-B e do Dashboard e as telas
// "Sumário detalhado" e "Atividade").
//
// Tudo é calculado a partir do que a pessoa registra no app:
//  - gastos e entradas do "Novo gasto" (transações do FinanceiroProvider)
//  - depósitos e retiradas das Metas
// TODO (backend): quando existirem endpoints de transações e metas, só trocar a
// origem dessas listas no FinanceiroProvider; essas contas continuam iguais.

import { habitoGuardar, type Meta } from "@/features/metasData";
import type { Transacao } from "@/features/financeiroContext";

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

const MESES_CURTOS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

// Cor de cada item do card Sumário
const COR_GASTOS = "#FF8800";
const COR_ECONOMIAS = "#B7FF00";
const COR_PLANOS = "#A357FF";

// Quantas movimentações no mesmo dia definem cada nível de atividade
const MOVIMENTOS_NIVEL_MEDIO = 2;
const MOVIMENTOS_NIVEL_ALTO = 3;

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

// Limita o valor entre 0 e 100 (usado nas barras de porcentagem)
function limitar(valor: number): number {
  return Math.min(Math.max(Math.round(valor), 0), 100);
}

// A transação vale no mês (mes de 1 a 12)? Se for "repetir mensalmente", vale
// em todo mês a partir do mês dela.
export function transacaoContaNoMes(
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

// Soma (em reais) das transações de um tipo que valem no mês
export function somarTransacoes(
  transacoes: Transacao[],
  tipo: Transacao["tipo"],
  mes: number,
  ano: number
): number {
  const centavos = transacoes
    .filter(
      (transacao) =>
        transacao.tipo === tipo && transacaoContaNoMes(transacao, mes, ano)
    )
    .reduce((soma, transacao) => soma + Math.round(transacao.valor * 100), 0);

  return centavos / 100;
}

// Renda do mês: soma das entradas do Novo gasto; se não houver, usa o salário
// informado na configuração inicial (0 = ainda não dá pra saber).
export function rendaDoMes(
  transacoes: Transacao[],
  salario: number | undefined,
  mes: number,
  ano: number
): number {
  const entradas = somarTransacoes(transacoes, "entrada", mes, ano);

  if (entradas > 0) {
    return entradas;
  }

  return salario && salario > 0 ? salario : 0;
}

// ---------------------------------------------------------------------------
// Sumário
// ---------------------------------------------------------------------------

export interface ItemSumario {
  label: string;
  valor: number;
  // Tamanho da barra (0 a 100)
  porcentagem: number;
  cor: string;
}

export interface ResumoSumario {
  nomeMes: string;
  ano: number;
  // true = ainda não dá pra calcular (nenhuma entrada nem salário)
  semRenda: boolean;
  gastos: number;
  // Quanto foi guardado nas metas no mês (depósitos - retiradas)
  economias: number;
  // O que sobrou da renda depois de gastar e guardar
  disponivel: number;
  // Gastos dos últimos 6 meses, do mais antigo ao mais novo
  ultimosMeses: { mes: string; valor: number }[];
  // Os 3 itens do card Sumário (Gastos, Economias e Planos)
  itens: ItemSumario[];
}

export function calcularSumario(
  transacoes: Transacao[],
  metas: Meta[],
  salario?: number,
  hoje: Date = new Date()
): ResumoSumario {
  const mes = hoje.getMonth() + 1;
  const ano = hoje.getFullYear();

  const renda = rendaDoMes(transacoes, salario, mes, ano);
  const gastos = somarTransacoes(transacoes, "gasto", mes, ano);

  // Economias = o que foi guardado nas metas neste mês (mesmo cálculo do
  // "Hábito de guardar" das Análises de Metas)
  const economias = arredondar(habitoGuardar(metas, 1)[0]?.valor ?? 0);

  // Planos = metas em andamento: valor total que ela quer juntar e quanto
  // disso já foi guardado
  const emAndamento = metas.filter((meta) => meta.status === "andamento");
  const totalPlanos = emAndamento.reduce((soma, meta) => soma + meta.valorTotal, 0);
  const guardadoPlanos = emAndamento.reduce((soma, meta) => soma + meta.valorAtual, 0);

  // Gastos dos últimos 6 meses (o último é o mês atual)
  const ultimosMeses = Array.from({ length: 6 }, (_, indice) => {
    const referencia = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - indice), 1);

    return {
      mes: MESES_CURTOS[referencia.getMonth()],
      valor: somarTransacoes(
        transacoes,
        "gasto",
        referencia.getMonth() + 1,
        referencia.getFullYear()
      ),
    };
  });

  return {
    nomeMes: NOMES_MESES[mes - 1],
    ano,
    semRenda: renda <= 0,
    gastos,
    economias,
    disponivel: renda > 0 ? Math.max(0, arredondar(renda - gastos - economias)) : 0,
    ultimosMeses,
    itens: [
      {
        label: "Gastos",
        valor: gastos,
        // Barras de Gastos e Economias = % da renda do mês
        porcentagem: renda > 0 ? limitar((gastos / renda) * 100) : 0,
        cor: COR_GASTOS,
      },
      {
        label: "Economias",
        valor: economias,
        porcentagem: renda > 0 ? limitar((economias / renda) * 100) : 0,
        cor: COR_ECONOMIAS,
      },
      {
        label: "Planos",
        valor: totalPlanos,
        // Barra de Planos = % já guardado das metas em andamento
        porcentagem: totalPlanos > 0 ? limitar((guardadoPlanos / totalPlanos) * 100) : 0,
        cor: COR_PLANOS,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Atividade
// ---------------------------------------------------------------------------

export type NivelAtividade = "alta" | "media" | "baixa" | "nenhuma";

// Nome e cor de cada nível (iguais ao protótipo da tela Atividade). Usados pelo
// card e pela tela, assim o mesmo dia tem a mesma cor nos dois.
// A ordem daqui é a ordem da legenda.
export const NIVEIS_ATIVIDADE: { id: NivelAtividade; rotulo: string; cor: string }[] = [
  { id: "nenhuma", rotulo: "Nenhuma", cor: "#1B1530" },
  { id: "baixa", rotulo: "Baixa", cor: "#B7FF00" },
  { id: "media", rotulo: "Média", cor: "#F2E01B" },
  { id: "alta", rotulo: "Alta", cor: "#FF8800" },
];

export interface ResumoAtividade {
  mes: string;
  ano: number;
  // Todos os dias do mês, com a data no formato AAAA-MM-DD
  dias: { data: string; nivel: NivelAtividade }[];
}

function nivelDoDia(movimentos: number): NivelAtividade {
  if (movimentos >= MOVIMENTOS_NIVEL_ALTO) return "alta";
  if (movimentos >= MOVIMENTOS_NIVEL_MEDIO) return "media";
  if (movimentos >= 1) return "baixa";
  return "nenhuma";
}

// Atividade do mês = quantas movimentações a pessoa teve em cada dia
// (gastos e entradas do Novo gasto + depósitos e retiradas das metas).
// 1 movimento = baixa, 2 = média, 3 ou mais = alta.
export function calcularAtividade(
  transacoes: Transacao[],
  metas: Meta[],
  hoje: Date = new Date()
): ResumoAtividade {
  const mes = hoje.getMonth() + 1;
  const ano = hoje.getFullYear();
  const prefixo = `${ano}-${String(mes).padStart(2, "0")}`;
  const diasNoMes = new Date(ano, mes, 0).getDate();

  // Movimentações por dia (chave AAAA-MM-DD)
  const porDia: Record<string, number> = {};

  const contar = (dataIso: string) => {
    porDia[dataIso] = (porDia[dataIso] ?? 0) + 1;
  };

  // A data da transação é DD/MM/AAAA. Aqui conta só o dia em que ela foi
  // registrada (não as repetições mensais).
  for (const transacao of transacoes) {
    const [dia, mesTransacao, anoTransacao] = transacao.data.split("/");

    contar(`${anoTransacao}-${mesTransacao}-${dia}`);
  }

  for (const meta of metas) {
    for (const movimento of meta.movimentacoes) {
      contar(movimento.data);
    }
  }

  return {
    mes: NOMES_MESES[mes - 1],
    ano,
    dias: Array.from({ length: diasNoMes }, (_, indice) => {
      const data = `${prefixo}-${String(indice + 1).padStart(2, "0")}`;

      return { data, nivel: nivelDoDia(porDia[data] ?? 0) };
    }),
  };
}