import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import test from "node:test";

const bancoDeTeste = process.env.FINNITUS_TEST_DATABASE_URL;

test("API salva categorias por conta e mantém vínculos com lançamentos", {
  skip: !bancoDeTeste && "Configure FINNITUS_TEST_DATABASE_URL com um banco de teste migrado.",
}, async (t) => {
  process.env.DATABASE_URL = bancoDeTeste;
  process.env.JWT_SECRET = randomUUID();
  const origem = "http://localhost:8081";
  process.env.CORS_ORIGINS = origem;
  const { default: app } = await import("../src/Servidor/app.js");
  const { prisma } = await import("../src/lib/prisma.js");
  const { criarSessao } = await import("../src/services/sessao.service.js");

  const servidor = app.listen(0, "127.0.0.1");
  t.after(() => new Promise<void>((resolve, reject) => {
    servidor.close((erro) => erro ? reject(erro) : resolve());
  }));
  await once(servidor, "listening");
  const endereco = servidor.address();
  assert.ok(endereco && typeof endereco !== "string");
  const base = `http://127.0.0.1:${endereco.port}`;
  const rota = "/categorias-personalizadas";
  const ids: number[] = [];

  t.after(async () => {
    const where = { id_Usuario: { in: ids } };
    try {
      await prisma.$transaction([
        prisma.notificacao.deleteMany({ where }),
        prisma.receita.deleteMany({ where }),
        prisma.despesa.deleteMany({ where }),
        prisma.divida.deleteMany({ where }),
        prisma.categoriaPersonalizada.deleteMany({ where }),
        prisma.sessaoUsuario.deleteMany({ where }),
        prisma.usuario.deleteMany({ where }),
      ]);
    } finally {
      await prisma.$disconnect();
    }
  });

  async function novaConta() {
    const usuario = await prisma.usuario.create({ data: {
      Unome: "Teste de categorias",
      Uemail: `${randomUUID()}@teste.invalid`,
      Udata_cadastro: new Date(),
      UTipo: "USUARIO",
    } });
    ids.push(usuario.id_Usuario);
    return prisma.$transaction((tx) =>
      criarSessao(tx, usuario.id_Usuario, usuario.tokenVersion, "Teste"),
    );
  }

  async function requisitar(metodo: string, caminho: string, token?: string, corpo?: object) {
    return fetch(`${base}${caminho}`, {
      method: metodo,
      headers: {
        Origin: origem,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(corpo && { "Content-Type": "application/json" }),
      },
      body: corpo && JSON.stringify(corpo),
    });
  }

  async function conferir(resposta: Response, status: number) {
    const corpo = await resposta.text();
    assert.equal(resposta.status, status, corpo);
    return corpo ? JSON.parse(corpo) : undefined;
  }

  const preflight = await fetch(`${base}${rota}`, {
    method: "OPTIONS",
    headers: {
      Origin: origem,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type,authorization",
    },
  });
  await conferir(preflight, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), origem);
  await conferir(await requisitar("GET", rota), 401);

  const contaA = await novaConta();
  const contaB = await novaConta();
  const criacao = await requisitar("POST", rota, contaA, { nome: "  Educação  ", tipo: "DESPESA" });
  assert.equal(criacao.headers.get("access-control-allow-origin"), origem);
  const categoria = await conferir(criacao, 201);
  assert.equal(categoria.nome, "Educação");
  assert.equal(categoria.id_Usuario, ids[0]);
  assert.deepEqual(await conferir(await requisitar("GET", rota, contaA), 200), [categoria]);
  assert.deepEqual(await conferir(await requisitar("GET", rota, contaB), 200), []);
  const rotaCategoria = `${rota}/${categoria.id_CategoriaPersonalizada}`;
  await conferir(await requisitar("GET", rotaCategoria, contaB), 404);
  await conferir(await requisitar("POST", rota, contaA, { nome: "EDUCACAO", tipo: "DESPESA" }), 409);
  await conferir(await requisitar("POST", rota, contaA, { nome: "Educação", tipo: "RECEITA" }), 201);

  const concorrentes = await Promise.all([
    requisitar("POST", rota, contaA, { nome: "Saúde", tipo: "DESPESA" }),
    requisitar("POST", rota, contaA, { nome: "SAUDE", tipo: "DESPESA" }),
  ]);
  assert.deepEqual(concorrentes.map((resposta) => resposta.status).sort(), [201, 409]);
  await Promise.all(concorrentes.map((resposta) => resposta.text()));

  const lancamento = {
    id_CategoriaPersonalizada: categoria.id_CategoriaPersonalizada,
    descricao: "Aula",
    valor: 10,
    tipo: "VARIAVEL",
    frequencia: "UNICA",
    status: "PENDENTE",
  };
  const despesaData = { ...lancamento, data_vencimento: "2026-01-20" };
  await conferir(await requisitar("POST", "/despesas", contaB, despesaData), 400);
  await conferir(await requisitar("POST", "/receitas", contaA, {
    ...lancamento,
    data_recebimento: "2026-01-20",
  }), 400);
  const despesa = await conferir(await requisitar("POST", "/despesas", contaA, despesaData), 201);
  assert.equal(despesa.id_CategoriaPersonalizada, categoria.id_CategoriaPersonalizada);
  const despesaLida = await conferir(await requisitar("GET", `/despesas/${despesa.id_Despesa}`, contaA), 200);
  assert.equal(despesaLida.id_CategoriaPersonalizada, categoria.id_CategoriaPersonalizada);

  const renomeada = await conferir(await requisitar("PUT", rotaCategoria, contaA, {
    nome: "Cursos",
  }), 200);
  assert.equal(renomeada.nome, "Cursos");
  await conferir(await requisitar("PUT", rotaCategoria, contaA, { tipo: "RECEITA" }), 409);
  await conferir(await requisitar("DELETE", rotaCategoria, contaA), 409);
  await conferir(await requisitar("DELETE", `/despesas/${despesa.id_Despesa}`, contaA), 200);
  await conferir(await requisitar("DELETE", rotaCategoria, contaA), 204);
  await conferir(await requisitar("GET", rotaCategoria, contaA), 404);

  const nova = await conferir(await requisitar("POST", rota, contaA, { nome: "Cinema", tipo: "DESPESA" }), 201);
  const [vinculo, exclusao] = await Promise.all([
    requisitar("POST", "/despesas", contaA, {
      ...despesaData,
      id_CategoriaPersonalizada: nova.id_CategoriaPersonalizada,
    }),
    requisitar("DELETE", `${rota}/${nova.id_CategoriaPersonalizada}`, contaA),
  ]);
  if (vinculo.status === 201) {
    const vinculada = await conferir(vinculo, 201);
    assert.equal(vinculada.id_CategoriaPersonalizada, nova.id_CategoriaPersonalizada);
    await conferir(exclusao, 409);
  } else {
    await conferir(vinculo, 400);
    await conferir(exclusao, 204);
  }
});
