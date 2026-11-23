import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import test from "node:test";

const bancoDeTeste = process.env.FINNITUS_TEST_DATABASE_URL;

test("Central registra avisos de operações e prazos, respeita preferências e isola as contas", {
  skip: !bancoDeTeste && "Configure FINNITUS_TEST_DATABASE_URL com um banco de teste migrado.",
}, async (t) => {
  process.env.DATABASE_URL = bancoDeTeste;
  process.env.JWT_SECRET = randomUUID();

  const { default: app } = await import("../src/Servidor/app.js");
  const { prisma } = await import("../src/lib/prisma.js");
  const { criarSessao } = await import("../src/services/sessao.service.js");
  const { registrarAvisosPeriodicos } = await import("../src/services/notificacoes.periodicas.js");
  const ids: number[] = [];

  const servidor = app.listen(0, "127.0.0.1");
  t.after(async () => {
    await new Promise<void>((resolve, reject) => {
      servidor.close((erro) => erro ? reject(erro) : resolve());
    });
    const where = { id_Usuario: { in: ids } };
    try {
      await prisma.$transaction([
        prisma.evento.deleteMany({ where }),
        prisma.receita.deleteMany({ where }),
        prisma.despesa.deleteMany({ where }),
        prisma.divida.deleteMany({ where }),
        prisma.reservaFinanceira.deleteMany({ where }),
        prisma.imprevisto.deleteMany({ where }),
        prisma.usuario.deleteMany({ where }),
      ]);
    } finally {
      await prisma.$disconnect();
    }
  });

  await once(servidor, "listening");
  const endereco = servidor.address();
  assert.ok(endereco && typeof endereco !== "string");
  const base = `http://127.0.0.1:${endereco.port}`;

  async function novaConta() {
    const usuario = await prisma.usuario.create({ data: {
      Unome: "Teste de notificações",
      Uemail: `${randomUUID()}@teste.invalid`,
      Udata_cadastro: new Date(),
      UTipo: "USUARIO",
    } });
    ids.push(usuario.id_Usuario);
    const token = await prisma.$transaction((tx) =>
      criarSessao(tx, usuario.id_Usuario, usuario.tokenVersion, "Teste"),
    );
    return { id: usuario.id_Usuario, token };
  }

  const principal = await novaConta();
  const outra = await novaConta();

  async function chamar(metodo: string, rota: string, status: number | number[], dados?: object, token = principal.token) {
    const resposta = await fetch(`${base}${rota}`, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(dados && { "Content-Type": "application/json" }),
      },
      body: dados && JSON.stringify(dados),
    });
    const texto = await resposta.text();
    if (typeof status === "number") assert.equal(resposta.status, status, texto);
    else assert.ok(status.includes(resposta.status), `${resposta.status}: ${texto}`);
    return texto ? JSON.parse(texto) : undefined;
  }

  const receitaBase = { descricao: "Serviço", valor: 125, tipo: "FIXA", frequencia: "UNICA", status: "PENDENTE" };
  const despesaBase = { ...receitaBase, descricao: "Internet", valor: 30, forma_pagamento: "PIX" };
  const receita = await chamar("POST", "/receitas", 201, { ...receitaBase, data_recebimento: "2024-03-09" });
  const despesa = await chamar("POST", "/despesas", 201, { ...despesaBase, data_vencimento: "2024-03-09" });
  await Promise.all([
    chamar("PUT", `/receitas/${receita.id_Receita}`, 200, { status: "RECEBIDA" }),
    chamar("PUT", `/receitas/${receita.id_Receita}`, 200, { status: "RECEBIDA" }),
    chamar("PUT", `/despesas/${despesa.id_Despesa}`, 200, { status: "PAGA" }),
    chamar("PUT", `/despesas/${despesa.id_Despesa}`, 200, { status: "PAGA" }),
  ]);

  const divida = await chamar("POST", "/dividas", 201, {
    nome: "Parcela", valor_total: 60, valor_parcela: 30,
    quantidade_parcelas: 2, parcelas_restantes: 2, data_vencimento: "2024-05-07",
  });
  await chamar("POST", "/reserva", 201);
  await chamar("POST", "/reserva/depositos", 200, { valor: 50 });
  await chamar("POST", "/reserva/retiradas", 200, { valor: 5 });
  await chamar("POST", "/imprevistos", 201, {
    Inome: "Reparo", Ivalor: 70, Idata: "2024-04-10", tipo: "DESPESA_INESPERADA",
  });
  const evento = {
    idEventoExterno: randomUUID(), tituloEvento: "Boleto", dataInicio: "2024-05-15T12:00:00Z",
    tipoMovimentacao: "DESPESA", descricao: "Boleto", valor: 50, data: "2024-05-15",
  };
  const confirmacoes = await Promise.all([
    chamar("POST", "/calendario/confirmar-evento", [201, 409], evento),
    chamar("POST", "/calendario/confirmar-evento", [201, 409], evento),
  ]);
  assert.equal(confirmacoes.filter((resposta) => resposta.movimentacao).length, 1);

  await chamar("POST", "/receitas", 201, { ...receitaBase, data_recebimento: "2024-05-07" });
  await chamar("POST", "/despesas", 201, { ...despesaBase, data_vencimento: "2024-04-29" });
  await chamar("POST", "/despesas", 201, { ...despesaBase, data_vencimento: "2024-05-08" });
  await prisma.meta.create({ data: {
    id_Usuario: principal.id, Mnome: "Viagem", Mvalor_objetivo: 150,
    Mtipo: "LONGO_PRAZO", Mconfigurada: true, Mprazo: new Date("2024-05-03"),
  } });

  // Às 02h UTC em 1º de maio, ainda é 30 de abril em São Paulo.
  const referencia = new Date("2024-05-01T02:00:00Z");
  await Promise.all([
    registrarAvisosPeriodicos(prisma, principal.id, referencia),
    registrarAvisosPeriodicos(prisma, principal.id, referencia),
  ]);
  await chamar("PUT", `/dividas/${divida.id_Divida}`, 200, { status: "QUITADA" });

  const dashboard = await chamar("GET", "/dashboard?data=2024-03-09", 200);
  assert.equal(dashboard.saldoRealizado, 95);
  const central = await chamar("GET", "/notificacoes?limite=100", 200);
  const avisos = central.notificacoes as { id_Notificacao: number; tipo: string; relacionadoTipo: string; mensagem: string }[];
  for (const tipo of [
    "RECEITA_RECEBIDA", "DESPESA_PAGA", "DIVIDA_CRIADA", "DIVIDA_QUITADA", "RESERVA_DEPOSITO",
    "RESERVA_RETIRADA", "IMPREVISTO_CRIADO", "EVENTO_CONFIRMADO", "META_PRAZO", "RESUMO_MENSAL",
  ]) {
    assert.equal(avisos.filter((aviso) => aviso.tipo === tipo).length, 1, tipo);
  }
  assert.equal(avisos.filter((aviso) => aviso.tipo === "RECEITA_CRIADA").length, 2);
  assert.equal(avisos.filter((aviso) => aviso.tipo === "DESPESA_CRIADA").length, 4);
  const vencimentos = avisos.filter((aviso) => aviso.tipo === "CONTA_VENCIMENTO");
  assert.deepEqual(vencimentos.map((aviso) => aviso.relacionadoTipo).sort(), ["DESPESA", "DIVIDA", "RECEITA"]);
  assert.ok(vencimentos.some((aviso) => aviso.mensagem.includes("29/04/2024")));
  assert.match(avisos.find((aviso) => aviso.tipo === "RESUMO_MENSAL")!.mensagem, /Saldo: R\$\s95,00/);

  const contas = await chamar("GET", "/notificacoes?categoria=contas", 200);
  assert.ok(contas.notificacoes.some((aviso: { tipo: string }) => aviso.tipo === "RESUMO_MENSAL"));
  assert.ok(contas.notificacoes.some((aviso: { tipo: string }) => aviso.tipo === "DIVIDA_CRIADA"));
  await chamar("PATCH", `/notificacoes/${avisos[0]!.id_Notificacao}/ler`, 404, undefined, outra.token);
  const lida = await chamar("PATCH", `/notificacoes/${avisos[0]!.id_Notificacao}/ler`, 200);
  assert.equal(lida.notificacao.lida, true);

  await chamar("PATCH", "/me/configuracoes", 200, { resumo: false, vencimento: false }, outra.token);
  const semAviso = await chamar("POST", "/receitas", 201, { ...receitaBase, data_recebimento: "2024-05-07" }, outra.token);
  await chamar("PUT", `/receitas/${semAviso.id_Receita}`, 200, { status: "RECEBIDA" }, outra.token);
  await registrarAvisosPeriodicos(prisma, outra.id, referencia);
  const outraCentral = await chamar("GET", "/notificacoes", 200, undefined, outra.token);
  assert.deepEqual(outraCentral.notificacoes, []);
});
