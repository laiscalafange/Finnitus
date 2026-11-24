/**
 * FINNITUS — conta de demonstração (03/11/2026 a 23/11/2026)
 *
 * SALVAR: src/backend/src/scripts/seedDemo.ts
 * EXECUTAR da pasta src/backend (PowerShell):
 *   npx tsx src/scripts/seedDemo.ts "SEU_EMAIL_CADASTRADO" --verificar
 *   npx tsx src/scripts/seedDemo.ts "SEU_EMAIL_CADASTRADO" --confirmar
 *
 * IMPORTANTE:
 * - Primeiro crie o e-mail e a conta pelo aplicativo.
 * - Não cria usuário/senha nem altera o e-mail, a senha ou a data de cadastro.
 * - Recusa contas com dados financeiros existentes; nunca apaga registros.
 * - Aceita uma reserva vazia criada pelo onboarding.
 * - Executa a inserção em uma única transação: falha => rollback.
 * - Rode apenas em ambiente de desenvolvimento / demonstração.
 */
import { prisma } from "../lib/prisma.js";

const DATA_INICIAL = "2026-11-03";
const DATA_FINAL = "2026-11-23";
const MARCADOR = "finnitus-seed-demo-nov2026-v2";

// Campos @db.Date devem receber Date. Meio-dia UTC evita virar o dia ao exibir no Brasil.
function dataSQL(data: string): Date {
  return new Date(`${data}T12:00:00.000Z`);
}
// Eventos: horário local de São Paulo, fuso -03 em novembro de 2026.
function horario(data: string, hora = "12:00"): Date {
  return new Date(`${data}T${hora}:00-03:00`);
}

type Forma = "PIX" | "DEBITO" | "CREDITO" | "BOLETO" | "DINHEIRO";
type FrequenciaReceita = "UNICA" | "SEMANAL" | "QUINZENAL" | "MENSAL" | "ANUAL";
type LancamentoDespesa = {
  data: string;
  descricao: string;
  valor: number;
  categoria: string;
  forma: Forma;
  fixa?: boolean;
  frequencia?: FrequenciaReceita;
  observacao?: string;
};

// Despesas PAGAS. Somam R$ 2.180,00 e sustentam os gráficos do dashboard.
const despesasPagas: LancamentoDespesa[] = [
  { data: "2026-11-04", descricao: "Aluguel de novembro", valor: 900, categoria: "Moradia", forma: "PIX", fixa: true },
  { data: "2026-11-05", descricao: "Mercado da semana", valor: 160, categoria: "Alimentação", forma: "DEBITO", frequencia: "SEMANAL" },
  { data: "2026-11-07", descricao: "Padaria", valor: 35, categoria: "Alimentação", forma: "PIX" },
  { data: "2026-11-11", descricao: "Hortifruti", valor: 80, categoria: "Alimentação", forma: "DEBITO" },
  { data: "2026-11-14", descricao: "Supermercado", valor: 145, categoria: "Alimentação", forma: "DEBITO" },
  { data: "2026-11-18", descricao: "Almoço no trabalho", valor: 55, categoria: "Alimentação", forma: "PIX" },
  { data: "2026-11-21", descricao: "Lanche", valor: 45, categoria: "Alimentação", forma: "PIX" },
  { data: "2026-11-05", descricao: "Bilhete de transporte", valor: 60, categoria: "Transporte", forma: "DEBITO" },
  { data: "2026-11-09", descricao: "Recarga de transporte", valor: 50, categoria: "Transporte", forma: "PIX" },
  { data: "2026-11-12", descricao: "Corrida por aplicativo", valor: 45, categoria: "Transporte", forma: "CREDITO" },
  { data: "2026-11-16", descricao: "Recarga de transporte", valor: 60, categoria: "Transporte", forma: "PIX" },
  { data: "2026-11-20", descricao: "Corrida por aplicativo", valor: 45, categoria: "Transporte", forma: "CREDITO" },
  { data: "2026-11-08", descricao: "Cinema", valor: 70, categoria: "Lazer", forma: "CREDITO" },
  { data: "2026-11-15", descricao: "Passeio no parque", valor: 30, categoria: "Lazer", forma: "PIX" },
  { data: "2026-11-21", descricao: "Jantar com amigos", valor: 80, categoria: "Lazer", forma: "DEBITO" },
  { data: "2026-11-10", descricao: "Farmácia", valor: 55, categoria: "Saúde", forma: "DEBITO" },
  { data: "2026-11-19", descricao: "Consulta", valor: 65, categoria: "Saúde", forma: "PIX" },
  { data: "2026-11-06", descricao: "Internet", valor: 90, categoria: "Outros", forma: "BOLETO", fixa: true },
  { data: "2026-11-13", descricao: "Assinatura digital", valor: 30, categoria: "Outros", forma: "CREDITO", fixa: true },
  { data: "2026-11-17", descricao: "Produtos de limpeza", valor: 45, categoria: "Outros", forma: "DEBITO" },
  { data: "2026-11-22", descricao: "Material doméstico", valor: 35, categoria: "Outros", forma: "DINHEIRO" },
];

// Contas pendentes: não entram em R$ 2.180,00 de despesas PAGAS.
const despesasPendentes: LancamentoDespesa[] = [
  { data: "2026-11-21", descricao: "Lavanderia em atraso", valor: 40, categoria: "Outros", forma: "PIX", observacao: "Vencida e ainda não paga; exemplo para testar pendências." },
  { data: "2026-11-27", descricao: "Conta de luz", valor: 110, categoria: "Moradia", forma: "BOLETO", fixa: true },
  { data: "2026-11-28", descricao: "Plano de celular", valor: 75, categoria: "Outros", forma: "CREDITO", fixa: true },
];

const receitas = [
  { data: "2026-11-03", descricao: "Salário mensal", valor: 3000, categoria: "Salário", tipo: "FIXA" as const, frequencia: "MENSAL" as const, status: "RECEBIDA" as const },
  { data: "2026-11-14", descricao: "Trabalho freelancer", valor: 200, categoria: "Trabalhos extras", tipo: "VARIAVEL" as const, frequencia: "UNICA" as const, status: "RECEBIDA" as const },
  { data: "2026-11-29", descricao: "Freelance a receber", valor: 250, categoria: "Trabalhos extras", tipo: "VARIAVEL" as const, frequencia: "UNICA" as const, status: "PENDENTE" as const },
];

type MovimentoMeta = { data: string; tipo: "APORTE" | "RETIRADA"; valor: number; descricao: string };
type MetaDemo = {
  nome: string;
  objetivo: number;
  criado: string;
  tipo: "LONGO_PRAZO" | "MENSAL";
  prazo: string;
  prioridade: "BAIXA" | "MEDIA" | "ALTA";
  status: "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";
  valorPeriodo: number;
  movimentos: MovimentoMeta[];
  mesReferencia?: string;
  conclusao?: string;
  cancelamento?: string;
};

const metas: MetaDemo[] = [
  { nome: "Viagem de férias", objetivo: 1000, criado: "2026-11-04", tipo: "LONGO_PRAZO", prazo: "2027-02-28", prioridade: "MEDIA", status: "EM_ANDAMENTO", valorPeriodo: 150,
    movimentos: [
      { data: "2026-11-04", tipo: "APORTE", valor: 150, descricao: "Primeiro depósito para viagem" },
      { data: "2026-11-12", tipo: "APORTE", valor: 100, descricao: "Dinheiro reservado" },
      { data: "2026-11-20", tipo: "APORTE", valor: 150, descricao: "Novo aporte da semana" },
    ],
  },
  { nome: "Celular novo", objetivo: 1800, criado: "2026-11-06", tipo: "LONGO_PRAZO", prazo: "2027-07-30", prioridade: "BAIXA", status: "EM_ANDAMENTO", valorPeriodo: 100,
    movimentos: [
      { data: "2026-11-06", tipo: "APORTE", valor: 100, descricao: "Aporte inicial" },
      { data: "2026-11-18", tipo: "APORTE", valor: 50, descricao: "Complemento" },
    ],
  },
  { nome: "Economizar em novembro", objetivo: 200, criado: "2026-11-05", tipo: "MENSAL", mesReferencia: "2026-11-01", prazo: "2026-11-30", prioridade: "ALTA", status: "EM_ANDAMENTO", valorPeriodo: 200,
    movimentos: [
      { data: "2026-11-05", tipo: "APORTE", valor: 100, descricao: "Economia da primeira semana" },
      { data: "2026-11-15", tipo: "APORTE", valor: 70, descricao: "Economia da segunda semana" },
      { data: "2026-11-19", tipo: "RETIRADA", valor: 50, descricao: "Readequação do orçamento" },
    ],
  },
  { nome: "Curso profissionalizante", objetivo: 350, criado: "2026-11-04", tipo: "LONGO_PRAZO", prazo: "2026-11-30", prioridade: "ALTA", status: "CONCLUIDA", conclusao: "2026-11-18", valorPeriodo: 150,
    movimentos: [
      { data: "2026-11-08", tipo: "APORTE", valor: 100, descricao: "Primeiro aporte" },
      { data: "2026-11-18", tipo: "APORTE", valor: 250, descricao: "Objetivo alcançado" },
    ],
  },
  { nome: "Academia (cancelada)", objetivo: 240, criado: "2026-11-05", tipo: "LONGO_PRAZO", prazo: "2027-01-31", prioridade: "BAIXA", status: "CANCELADA", cancelamento: "2026-11-14", valorPeriodo: 80, movimentos: [] },
];

const movimentosReserva = [
  { data: "2026-11-05", tipo: "DEPOSITO" as const, valor: 150 },
  { data: "2026-11-13", tipo: "DEPOSITO" as const, valor: 100 },
  { data: "2026-11-19", tipo: "RETIRADA" as const, valor: 50 },
];

function soma(items: { valor: number }[]): number {
  return items.reduce((total, item) => total + item.valor, 0);
}
function saldoMovimentos(items: { tipo: string; valor: number }[]): number {
  return items.reduce((total, item) => total + (item.tipo === "RETIRADA" ? -item.valor : item.valor), 0);
}
function conferirCenario() {
  if (soma(despesasPagas) !== 2180) throw new Error("Erro interno: despesas pagas devem somar R$ 2.180,00.");
  if (soma(despesasPendentes) !== 225) throw new Error("Erro interno: despesas pendentes devem somar R$ 225,00.");
  if (soma(receitas.filter(r => r.status === "RECEBIDA")) !== 3200) throw new Error("Erro interno: receitas recebidas devem somar R$ 3.200,00.");
  if (saldoMovimentos(movimentosReserva) !== 200) throw new Error("Erro interno: a reserva deve ter saldo R$ 200,00.");
  for (const meta of metas) {
    const saldo = saldoMovimentos(meta.movimentos);
    if (saldo < 0) throw new Error(`Saldo negativo na meta ${meta.nome}`);
    if (meta.status === "CONCLUIDA" && saldo < meta.objetivo) throw new Error(`Meta concluída incompleta: ${meta.nome}`);
  }
}

async function verificarConta(id: number) {
  const [quantidades, reserva] = await Promise.all([
    Promise.all([
      prisma.receita.count({ where: { id_Usuario: id } }),
      prisma.despesa.count({ where: { id_Usuario: id } }),
      prisma.meta.count({ where: { id_Usuario: id } }),
      prisma.evento.count({ where: { id_Usuario: id } }),
      prisma.imprevisto.count({ where: { id_Usuario: id } }),
      prisma.categoriaPersonalizada.count({ where: { id_Usuario: id } }),
      prisma.divida.count({ where: { id_Usuario: id } }),
    ]),
    prisma.reservaFinanceira.findUnique({ where: { id_Usuario: id }, include: { movimentacoes: { select: { id_Movimentacao: true } } } }),
  ]);
  if (quantidades.some(quantidade => quantidade > 0)) {
    throw new Error("A conta já contém lançamentos, metas, eventos, dívidas ou categorias personalizadas. Use uma CONTA DEMO nova e vazia. Nenhum dado foi alterado.");
  }
  if (reserva && (Number(reserva.valor_atual) !== 0 || reserva.movimentacoes.length > 0)) {
    throw new Error("A conta já tem saldo ou movimentações de reserva. Nenhum dado foi alterado.");
  }
  // Configurações, sessões de login e notificações automáticas do cadastro podem existir.
  return { reservaInicialVazia: Boolean(reserva) };
}

async function main() {
  conferirCenario();
  const email = (process.argv[2] ?? "").trim();
  const verificar = process.argv.includes("--verificar");
  const confirmar = process.argv.includes("--confirmar");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || verificar === confirmar) {
    throw new Error('Uso: npx tsx src/scripts/seedDemo.ts "email-ja-cadastrado@dominio.com" --verificar (ou --confirmar).');
  }
  const usuario = await prisma.usuario.findUnique({ where: { Uemail: email } });
  if (!usuario) throw new Error(`Não foi encontrada conta com o e-mail ${email}. Primeiro cadastre-se pelo aplicativo.`);

  const situacao = await verificarConta(usuario.id_Usuario);
  console.log(`Conta localizada: ${usuario.Unome} | e-mail: ${usuario.Uemail} | id: ${usuario.id_Usuario}`);
  console.log(`Reserva inicial vazia já existente: ${situacao.reservaInicialVazia ? "sim" : "não"}`);
  if (verificar) {
    console.log("Pré-verificação concluída: conta apta. Nenhum dado foi inserido. Execute com --confirmar para popular.");
    return;
  }

  // Transação atômica: em qualquer erro, o banco desfaz tudo que foi escrito aqui.
  const resumo = await prisma.$transaction(async tx => {
    const id = usuario.id_Usuario;
    // Nova checagem para o caso de a conta ser usada entre --verificar e --confirmar.
    if ((await tx.receita.count({ where: { id_Usuario: id } })) > 0 ||
        (await tx.despesa.count({ where: { id_Usuario: id } })) > 0 ||
        (await tx.meta.count({ where: { id_Usuario: id } })) > 0 ||
        (await tx.evento.count({ where: { id_Usuario: id } })) > 0 ||
        (await tx.categoriaPersonalizada.count({ where: { id_Usuario: id } })) > 0) {
      throw new Error("A conta deixou de estar vazia. A transação foi cancelada.");
    }

    const categorias = new Map<string, number>();
    for (const nome of ["Moradia", "Alimentação", "Transporte", "Lazer", "Saúde", "Outros"]) {
      const registro = await tx.categoriaPersonalizada.create({ data: { id_Usuario: id, nome, tipo: "DESPESA" } });
      categorias.set(`DESPESA:${nome}`, registro.id_CategoriaPersonalizada);
    }
    for (const nome of ["Salário", "Trabalhos extras"]) {
      const registro = await tx.categoriaPersonalizada.create({ data: { id_Usuario: id, nome, tipo: "RECEITA" } });
      categorias.set(`RECEITA:${nome}`, registro.id_CategoriaPersonalizada);
    }

    const idsEventos = new Map<string, number>();
    for (const receita of receitas) {
      const criada = await tx.receita.create({
        data: {
          id_Usuario: id,
          id_CategoriaPersonalizada: categorias.get(`RECEITA:${receita.categoria}`),
          descricao: receita.descricao,
          valor: receita.valor,
          data_recebimento: dataSQL(receita.data),
          tipo: receita.tipo,
          frequencia: receita.frequencia,
          status: receita.status,
          observacao: receita.status === "PENDENTE" ? "Previsão: valor ainda não recebido" : "Receita demonstrativa",
          createdAt: horario(receita.status === "PENDENTE" ? "2026-11-23" : receita.data, "09:00"),
        },
      });
      const evento = await tx.evento.create({ data: {
        id_Usuario: id,
        Enome: receita.descricao,
        Edescricao: receita.status === "RECEBIDA" ? "Recebimento confirmado" : "Recebimento previsto e pendente",
        data_inicio: horario(receita.data, "09:00"),
        tipo: "RECEBIMENTO",
        origem: "FINNITUS",
        status_financeiro: "CONFIRMADO",
        valor_relacionado: receita.valor,
        id_Receita: criada.id_Receita,
      } });
      idsEventos.set(receita.descricao, evento.id_Evento);
    }

    for (const [lista, paga] of [[despesasPagas, true], [despesasPendentes, false]] as const) {
      for (const item of lista) {
        const criada = await tx.despesa.create({ data: {
          id_Usuario: id,
          id_CategoriaPersonalizada: categorias.get(`DESPESA:${item.categoria}`),
          descricao: item.descricao,
          valor: item.valor,
          data_vencimento: dataSQL(item.data),
          data_pagamento: paga ? dataSQL(item.data) : null,
          tipo: item.fixa ? "FIXA" : "VARIAVEL",
          frequencia: item.frequencia ?? (item.fixa ? "MENSAL" : "UNICA"),
          forma_pagamento: paga ? item.forma : null,
          status: paga ? "PAGA" : "PENDENTE",
          observacao: item.observacao ?? (paga ? "Pagamento fictício confirmado" : `Forma prevista: ${item.forma}`),
          createdAt: horario(paga ? item.data : "2026-11-19", "10:00"),
        } });
        const evento = await tx.evento.create({ data: {
          id_Usuario: id,
          Enome: item.descricao,
          Edescricao: paga ? "Despesa já paga" : "Conta a pagar",
          data_inicio: horario(item.data, "10:00"),
          tipo: "PAGAMENTO",
          origem: "FINNITUS",
          status_financeiro: "CONFIRMADO",
          valor_relacionado: item.valor,
          id_Despesa: criada.id_Despesa,
        } });
        idsEventos.set(item.descricao, evento.id_Evento);
      }
    }

    const idsMetas = new Map<string, number>();
    for (const item of metas) {
      const atual = saldoMovimentos(item.movimentos);
      const meta = await tx.meta.create({ data: {
        id_Usuario: id,
        Mnome: item.nome,
        Mvalor_objetivo: item.objetivo,
        Mvalor_atual: atual,
        Mvalor_periodo: item.valorPeriodo,
        Mtipo: item.tipo,
        Mmes_referencia: item.mesReferencia ? dataSQL(item.mesReferencia) : null,
        Mprazo: dataSQL(item.prazo),
        Mprioridade: item.prioridade,
        Mstatus: item.status,
        Mdata_criacao: horario(item.criado, "11:00"),
        Mdata_conclusao: item.conclusao ? horario(item.conclusao, "11:00") : null,
        Mdata_cancelamento: item.cancelamento ? horario(item.cancelamento, "11:00") : null,
        Mconfigurada: true,
      } });
      idsMetas.set(item.nome, meta.id_Meta);
      for (const mov of item.movimentos) {
        await tx.movimentacaoMeta.create({ data: {
          id_Meta: meta.id_Meta,
          valor: mov.valor,
          tipo: mov.tipo,
          data: horario(mov.data, "11:00"),
          descricao: mov.descricao,
        } });
      }
    }

    const reserva = await tx.reservaFinanceira.upsert({
      where: { id_Usuario: id },
      create: {
        id_Usuario: id,
        valor_atual: 200,
        valor_desejado: 1500,
        objetivo: "Reserva de emergência",
        localizacao: "Conta separada (simulação)",
        tempo_economia: 6,
      },
      update: {
        valor_atual: 200,
        valor_desejado: 1500,
        objetivo: "Reserva de emergência",
        localizacao: "Conta separada (simulação)",
        tempo_economia: 6,
      },
    });
    for (const movimento of movimentosReserva) {
      await tx.movimentacaoReserva.create({ data: {
        id_Reserva: reserva.id_Reserva,
        tipo: movimento.tipo,
        valor: movimento.valor,
        data: horario(movimento.data, "13:00"),
      } });
    }

    const imprevistos = [
      { nome: "Conserto inesperado do celular", data: "2026-11-19", valor: 280, tipo: "DESPESA_INESPERADA" as const, solucao: "Reserva e corte de lazer", descricao: "Simulação de imprevisto no Plano B; não significa que a despesa foi paga." },
      { nome: "Aumento dos custos de transporte", data: "2026-11-16", valor: 90, tipo: "AUMENTO_DESPESA" as const, solucao: "Ajustar orçamento mensal", descricao: "Teste de alternativa do Plano B para aumento recorrente." },
      { nome: "Cancelamento de serviço extra", data: "2026-11-22", valor: 200, tipo: "PERDA_RENDA" as const, solucao: "Repriorizar metas", descricao: "Perda de renda esperada; não altera a receita já recebida." },
    ];
    for (const item of imprevistos) {
      await tx.imprevisto.create({ data: {
        id_Usuario: id,
        Inome: item.nome,
        tipo: item.tipo,
        Ivalor: item.valor,
        Idata: dataSQL(item.data),
        duracao_meses: item.tipo === "AUMENTO_DESPESA" ? 3 : 1,
        solucao_escolhida: item.solucao,
        Idescricao: item.descricao,
      } });
    }

    const dividas = [
      { nome: "Notebook parcelado", total: 900, parcela: 150, parcelas: 6, faltam: 4, vencimento: "2026-12-10", juros: 0, status: "ATIVA" as const },
      { nome: "Curso online quitado", total: 180, parcela: 60, parcelas: 3, faltam: 0, vencimento: "2026-11-08", juros: 0, status: "QUITADA" as const },
      { nome: "Fatura parcelada em atraso", total: 340, parcela: 85, parcelas: 4, faltam: 3, vencimento: "2026-11-20", juros: 2.5, status: "ATRASADA" as const },
    ];
    for (const item of dividas) {
      await tx.divida.create({ data: {
        id_Usuario: id,
        id_CategoriaPersonalizada: categorias.get("DESPESA:Outros"),
        nome: item.nome,
        valor_total: item.total,
        valor_parcela: item.parcela,
        quantidade_parcelas: item.parcelas,
        parcelas_restantes: item.faltam,
        data_vencimento: dataSQL(item.vencimento),
        taxa_juros: item.juros,
        status: item.status,
      } });
    }

    type EventoAvulso = {
      nome: string;
      descricao: string;
      data: string;
      hora: string;
      tipo: "OUTRO" | "META";
      origem: "FINNITUS" | "DISPOSITIVO";
      status: "NAO_FINANCEIRO" | "SUSPEITO" | "NAO_ANALISADO";
      valor: number | null;
      diaInteiro?: boolean;
      dataFim?: string;
      horaFim?: string;
    };
    const eventosAvulsos: EventoAvulso[] = [
      { nome: "Reunião no trabalho", descricao: "Compromisso não financeiro", data: "2026-11-09", hora: "14:00", tipo: "OUTRO" as const, origem: "FINNITUS" as const, status: "NAO_FINANCEIRO" as const, valor: null },
      { nome: "Revisar orçamento", descricao: "Revisão semanal das despesas", data: "2026-11-16", hora: "19:00", tipo: "OUTRO" as const, origem: "FINNITUS" as const, status: "NAO_FINANCEIRO" as const, valor: null },
      { nome: "Comprar presente (calendário)", descricao: "SIMULAÇÃO de evento vindo do dispositivo, revisar possível gasto", data: "2026-11-21", hora: "15:00", tipo: "OUTRO" as const, origem: "DISPOSITIVO" as const, status: "SUSPEITO" as const, valor: 80 },
      { nome: "Dentista (calendário)", descricao: "SIMULAÇÃO de evento ainda não analisado, não houve sincronização real", data: "2026-11-25", hora: "15:00", dataFim: "2026-11-25", horaFim: "16:00", tipo: "OUTRO" as const, origem: "DISPOSITIVO" as const, status: "NAO_ANALISADO" as const, valor: null },
      { nome: "Revisar meta de novembro", descricao: "Verificar progresso antes do fim do mês", data: "2026-11-26", hora: "18:00", tipo: "META" as const, origem: "FINNITUS" as const, status: "NAO_FINANCEIRO" as const, valor: null },
      { nome: "Aniversário em família", descricao: "Evento de dia inteiro, sem impacto financeiro", data: "2026-11-22", hora: "12:00", diaInteiro: true, tipo: "OUTRO" as const, origem: "FINNITUS" as const, status: "NAO_FINANCEIRO" as const, valor: null },
      { nome: "Planejar compras de dezembro", descricao: "Definir limites antes de gastar", data: "2026-11-30", hora: "19:00", tipo: "OUTRO" as const, origem: "FINNITUS" as const, status: "NAO_FINANCEIRO" as const, valor: null },
    ];
    for (const item of eventosAvulsos) {
      const evento = await tx.evento.create({ data: {
        id_Usuario: id,
        Enome: item.nome,
        Edescricao: item.descricao,
        data_inicio: horario(item.data, item.hora),
        data_fim: item.dataFim && item.horaFim ? horario(item.dataFim, item.horaFim) : null,
        dia_inteiro: item.diaInteiro ?? false,
        tipo: item.tipo,
        origem: item.origem,
        id_evento_externo: item.origem === "DISPOSITIVO" ? `${MARCADOR}-${item.data}-${item.hora}` : null,
        status_financeiro: item.status,
        valor_relacionado: item.valor,
      } });
      idsEventos.set(item.nome, evento.id_Evento);
    }

    // Preserva configurações que o app eventualmente já criou no onboarding.
    const config = await tx.configuracaoUsuario.findUnique({ where: { id_Usuario: id } });
    if (!config) {
      await tx.configuracaoUsuario.create({ data: { id_Usuario: id } });
    }

    const notificacoes = [
      { data: "2026-11-03", titulo: "Bem-vindo ao Finnitus", texto: "Esta é sua conta de demonstração financeira.", tipo: "sistema", lida: true, ref: null as string | null },
      { data: "2026-11-18", titulo: "Objetivo alcançado", texto: "A meta Curso profissionalizante chegou a R$ 350.", tipo: "meta", lida: true, ref: "meta:Curso profissionalizante" },
      { data: "2026-11-20", titulo: "Aporte na meta", texto: "Você registrou um aporte na meta Viagem de férias.", tipo: "meta", lida: false, ref: "meta:Viagem de férias" },
      { data: "2026-11-23", titulo: "Despesa pendente", texto: "Existe uma conta ainda não paga: Lavanderia em atraso.", tipo: "gastos", lida: false, ref: "evento:Lavanderia em atraso" },
      { data: "2026-11-23", titulo: "Próximo vencimento", texto: "A conta de luz vence em 27/11.", tipo: "vencimento", lida: false, ref: "evento:Conta de luz" },
    ];
    for (const [i, item] of notificacoes.entries()) {
      const [tipoRef, chaveRef] = item.ref?.split(":", 2) ?? [null, null];
      const relacionadoId = tipoRef === "meta" ? idsMetas.get(chaveRef!) : tipoRef === "evento" ? idsEventos.get(chaveRef!) : null;
      await tx.notificacao.create({ data: {
        id_Usuario: id,
        tipo: item.tipo,
        titulo: item.titulo,
        mensagem: item.texto,
        chaveEvento: `${MARCADOR}-${i}`,
        relacionadoTipo: tipoRef,
        relacionadoId: relacionadoId ?? null,
        lida: item.lida,
        criadaEm: horario(item.data, "09:00"),
        lidaEm: item.lida ? horario(item.data, "10:00") : null,
      } });
    }

    return {
      receitas: receitas.length,
      despesas: despesasPagas.length + despesasPendentes.length,
      metas: metas.length,
      movimentosMeta: metas.reduce((sum, m) => sum + m.movimentos.length, 0),
      reservaMovimentos: movimentosReserva.length,
      imprevistos: imprevistos.length,
      dividas: dividas.length,
      eventos: receitas.length + despesasPagas.length + despesasPendentes.length + eventosAvulsos.length,
      notificacoes: notificacoes.length,
      categorias: categorias.size,
    };
  }, { maxWait: 10000, timeout: 120000 });

  console.log(`\nDADOS DE DEMONSTRAÇÃO INSERIDOS em ${email} (${DATA_INICIAL} a ${DATA_FINAL}).`);
  console.table(resumo);
  console.log("Receitas recebidas: R$ 3.200,00 | Receitas previstas: R$ 250,00");
  console.log("Despesas pagas: R$ 2.180,00 | Despesas pendentes: R$ 225,00");
  console.log("Saldo simples (recebidas - pagas): R$ 1.020,00");
  console.log("Reserva: R$ 200,00 | Meta viagem: R$ 400,00 de R$ 1.000,00");
  console.log("Importante: o dashboard pode calcular outros indicadores conforme as regras do backend.");
}

main()
  .catch((erro: unknown) => {
    console.error("Não foi possível executar o seed:", erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
