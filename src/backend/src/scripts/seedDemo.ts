/**
 * Finnitus — dados de demonstração (03/11/2026 a 23/11/2026).
 * Salve em: src/backend/src/scripts/seedDemo.ts
 * Execute da pasta src/backend: npx tsx src/scripts/seedDemo.ts
 *
 * Antes: crie pelo aplicativo uma conta com o e-mail demo.finnitus@example.com.
 * Não executa exclusões. Só funciona em uma conta demo vazia.
 */
import { prisma } from "../lib/prisma.js";

const EMAIL_DEMO = "demo.finnitus@example.com";
const INICIO = "2026-11-03";
const FIM = "2026-11-23";
const MARCADOR = "finnitus-demo-2026-11-v1";

function dia(data: string): Date {
  return new Date(`${data}T12:00:00.000Z`);
}
function instante(data: string, hora = "12:00"): Date {
  return new Date(`${data}T${hora}:00.000Z`);
}

type LancamentoDespesa = {
  data: string;
  descricao: string;
  valor: number;
  categoria: string;
  forma: "PIX" | "DEBITO" | "CREDITO" | "BOLETO" | "DINHEIRO";
  fixa?: boolean;
};

const despesas: LancamentoDespesa[] = [
  { data: "2026-11-04", descricao: "Aluguel de novembro", valor: 900, categoria: "Moradia", forma: "PIX", fixa: true },
  { data: "2026-11-05", descricao: "Mercado da semana", valor: 160, categoria: "Alimentação", forma: "DEBITO" },
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
  { data: "2026-11-06", descricao: "Internet", valor: 90, categoria: "Outros", forma: "PIX", fixa: true },
  { data: "2026-11-13", descricao: "Assinatura digital", valor: 30, categoria: "Outros", forma: "CREDITO", fixa: true },
  { data: "2026-11-17", descricao: "Produtos de limpeza", valor: 45, categoria: "Outros", forma: "DEBITO" },
  { data: "2026-11-22", descricao: "Material doméstico", valor: 35, categoria: "Outros", forma: "PIX" },
];

async function main() {
  const usuario = await prisma.usuario.findUnique({ where: { Uemail: EMAIL_DEMO } });
  if (!usuario) {
    throw new Error(`Crie primeiro uma conta demo com o e-mail ${EMAIL_DEMO} pelo aplicativo.`);
  }
  if (usuario.Uemail !== EMAIL_DEMO) {
    throw new Error("Proteção: somente a conta demo pode ser utilizada.");
  }

  const totalReceitas = 3200;
  const totalDespesas = despesas.reduce((soma, item) => soma + item.valor, 0);
  if (totalDespesas !== 2180) throw new Error(`Soma de despesas inesperada: ${totalDespesas}`);

  await prisma.$transaction(async (tx) => {
    const id = usuario.id_Usuario;
    const [receitas, despesasExistentes, metas, eventos, imprevistos, categorias, dividas, notificacoes, reserva] = await Promise.all([
      tx.receita.count({ where: { id_Usuario: id } }),
      tx.despesa.count({ where: { id_Usuario: id } }),
      tx.meta.count({ where: { id_Usuario: id } }),
      tx.evento.count({ where: { id_Usuario: id } }),
      tx.imprevisto.count({ where: { id_Usuario: id } }),
      tx.categoriaPersonalizada.count({ where: { id_Usuario: id } }),
      tx.divida.count({ where: { id_Usuario: id } }),
      tx.notificacao.count({ where: { id_Usuario: id } }),
      tx.reservaFinanceira.findUnique({ where: { id_Usuario: id } }),
    ]);
    if (receitas + despesasExistentes + metas + eventos + imprevistos + categorias + dividas + notificacoes > 0 || reserva) {
      throw new Error("Conta demo já contém dados. Nenhuma alteração realizada. Use uma conta demo vazia.");
    }

    await tx.usuario.update({
      where: { id_Usuario: id },
      data: { Udata_cadastro: instante(INICIO, "09:00") },
    });

    const categoriasIds = new Map<string, number>();
    for (const nome of ["Moradia", "Alimentação", "Transporte", "Lazer", "Saúde", "Outros"]) {
      const cat = await tx.categoriaPersonalizada.create({
        data: { id_Usuario: id, nome, tipo: "DESPESA" },
      });
      categoriasIds.set(nome, cat.id_CategoriaPersonalizada);
    }
    const categoriaExtra = await tx.categoriaPersonalizada.create({
      data: { id_Usuario: id, nome: "Trabalhos extras", tipo: "RECEITA" },
    });

    const receitasDemo = [
      { descricao: "Salário mensal", valor: 3000, data: "2026-11-03", tipo: "FIXA" as const, frequencia: "MENSAL" as const },
      { descricao: "Trabalho freelancer", valor: 200, data: "2026-11-14", tipo: "VARIAVEL" as const, frequencia: "UNICA" as const },
    ];
    for (const item of receitasDemo) {
      const criada = await tx.receita.create({
        data: {
          id_Usuario: id,
          id_CategoriaPersonalizada: item.tipo === "VARIAVEL" ? categoriaExtra.id_CategoriaPersonalizada : null,
          descricao: item.descricao,
          valor: item.valor,
          data_recebimento: dia(item.data),
          tipo: item.tipo,
          frequencia: item.frequencia,
          status: "RECEBIDA",
          createdAt: instante(item.data, "09:00"),
        },
      });
      await tx.evento.create({
        data: {
          id_Usuario: id,
          Enome: item.descricao,
          Edescricao: "Recebimento confirmado",
          data_inicio: instante(item.data, "09:00"),
          dia_inteiro: false,
          tipo: "RECEBIMENTO",
          origem: "FINNITUS",
          status_financeiro: "CONFIRMADO",
          valor_relacionado: item.valor,
          id_Receita: criada.id_Receita,
        },
      });
    }

    for (const item of despesas) {
      const criada = await tx.despesa.create({
        data: {
          id_Usuario: id,
          id_CategoriaPersonalizada: categoriasIds.get(item.categoria)!,
          descricao: item.descricao,
          valor: item.valor,
          data_vencimento: dia(item.data),
          data_pagamento: dia(item.data),
          tipo: item.fixa ? "FIXA" : "VARIAVEL",
          frequencia: item.fixa ? "MENSAL" : "UNICA",
          forma_pagamento: item.forma,
          status: "PAGA",
          createdAt: instante(item.data, "10:00"),
        },
      });
      await tx.evento.create({
        data: {
          id_Usuario: id,
          Enome: item.descricao,
          Edescricao: "Despesa paga",
          data_inicio: instante(item.data, "10:00"),
          dia_inteiro: false,
          tipo: "PAGAMENTO",
          origem: "FINNITUS",
          status_financeiro: "CONFIRMADO",
          valor_relacionado: item.valor,
          id_Despesa: criada.id_Despesa,
        },
      });
    }

    const metasDemo = [
      { nome: "Viagem de férias", objetivo: 1000, atual: 400, periodo: 150, prazo: "2027-02-28", prioridade: "MEDIA" as const, criado: "2026-11-04", aportes: [["2026-11-04", 150], ["2026-11-12", 100], ["2026-11-20", 150]] as const },
      { nome: "Celular novo", objetivo: 1800, atual: 150, periodo: 100, prazo: "2027-07-30", prioridade: "BAIXA" as const, criado: "2026-11-06", aportes: [["2026-11-06", 100], ["2026-11-18", 50]] as const },
      { nome: "Curso profissionalizante", objetivo: 350, atual: 70, periodo: 50, prazo: "2027-01-31", prioridade: "ALTA" as const, criado: "2026-11-10", aportes: [["2026-11-10", 40], ["2026-11-22", 30]] as const },
    ];
    for (const item of metasDemo) {
      const meta = await tx.meta.create({
        data: {
          id_Usuario: id,
          Mnome: item.nome,
          Mvalor_objetivo: item.objetivo,
          Mvalor_atual: item.atual,
          Mvalor_periodo: item.periodo,
          Mtipo: "LONGO_PRAZO",
          Mprazo: dia(item.prazo),
          Mprioridade: item.prioridade,
          Mstatus: "EM_ANDAMENTO",
          Mdata_criacao: instante(item.criado, "11:00"),
          Mconfigurada: true,
        },
      });
      for (const [data, valor] of item.aportes) {
        await tx.movimentacaoMeta.create({
          data: { id_Meta: meta.id_Meta, tipo: "APORTE", valor, data: instante(data, "11:00"), descricao: "Aporte na meta" },
        });
      }
    }

    const reservaDemo = await tx.reservaFinanceira.create({
      data: {
        id_Usuario: id,
        valor_atual: 200,
        valor_desejado: 1500,
        objetivo: "Reserva de emergência",
        localizacao: "Conta separada",
        tempo_economia: 6,
      },
    });
    for (const movimento of [
      { data: "2026-11-05", tipo: "DEPOSITO" as const, valor: 150 },
      { data: "2026-11-13", tipo: "DEPOSITO" as const, valor: 100 },
      { data: "2026-11-19", tipo: "RETIRADA" as const, valor: 50 },
    ]) {
      await tx.movimentacaoReserva.create({
        data: { id_Reserva: reservaDemo.id_Reserva, tipo: movimento.tipo, valor: movimento.valor, data: instante(movimento.data, "13:00") },
      });
    }

    await tx.imprevisto.create({
      data: {
        id_Usuario: id,
        Inome: "Conserto inesperado do celular",
        tipo: "DESPESA_INESPERADA",
        Ivalor: 280,
        Idata: dia("2026-11-19"),
        duracao_meses: 1,
        solucao_escolhida: "Reduzir gastos e usar parte da reserva",
        Idescricao: "Simulação de planejamento para um gasto inesperado; não é uma despesa paga.",
      },
    });

    await tx.evento.createMany({
      data: [
        { id_Usuario: id, Enome: "Reunião no trabalho", Edescricao: "Compromisso pessoal sem impacto financeiro", data_inicio: instante("2026-11-09", "14:00"), tipo: "OUTRO", origem: "FINNITUS", status_financeiro: "NAO_FINANCEIRO" },
        { id_Usuario: id, Enome: "Revisar orçamento", Edescricao: "Conferir despesas do mês", data_inicio: instante("2026-11-16", "19:00"), tipo: "OUTRO", origem: "FINNITUS", status_financeiro: "NAO_FINANCEIRO" },
        { id_Usuario: id, Enome: "Vencimento da conta de luz", Edescricao: "Previsão: R$ 110, ainda não registrada como despesa", data_inicio: instante("2026-11-27", "12:00"), tipo: "PAGAMENTO", origem: "FINNITUS", status_financeiro: "NAO_ANALISADO", valor_relacionado: 110 },
        { id_Usuario: id, Enome: "Planejar compras de dezembro", Edescricao: "Definir limites antes de gastar", data_inicio: instante("2026-11-30", "19:00"), tipo: "OUTRO", origem: "FINNITUS", status_financeiro: "NAO_FINANCEIRO" },
      ],
    });

    await tx.notificacao.createMany({
      data: [
        { id_Usuario: id, tipo: "demo", titulo: "Bem-vindo ao Finnitus", mensagem: "Sua demonstração começou em 3 de novembro.", chaveEvento: `${MARCADOR}-boas-vindas`, criadaEm: instante("2026-11-03", "09:00"), lida: true, lidaEm: instante("2026-11-03", "09:15") },
        { id_Usuario: id, tipo: "demo", titulo: "Meta atualizada", mensagem: "Você fez um novo aporte na meta Viagem de férias.", chaveEvento: `${MARCADOR}-meta`, criadaEm: instante("2026-11-20", "11:00"), lida: true, lidaEm: instante("2026-11-20", "11:30") },
        { id_Usuario: id, tipo: "demo", titulo: "Revise o próximo vencimento", mensagem: "Há uma previsão de pagamento no calendário para 27/11.", chaveEvento: `${MARCADOR}-vencimento`, criadaEm: instante("2026-11-23", "09:00"), lida: false },
      ],
    });
  }, { maxWait: 10000, timeout: 120000 });

  console.log(`Demonstração criada para ${EMAIL_DEMO}: ${INICIO} a ${FIM}`);
  console.log(`Receitas R$ ${totalReceitas}; despesas pagas R$ ${totalDespesas}; saldo simples R$ ${totalReceitas - totalDespesas}.`);
  console.log("2 receitas, 21 despesas, 3 metas, 7 aportes, 1 reserva, 3 movimentações de reserva, 1 imprevisto, 27 eventos e 3 notificações.");
}

main()
  .catch((erro: unknown) => {
    console.error("Seed de demonstração não executado:", erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
