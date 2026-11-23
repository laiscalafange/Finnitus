import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { Writable } from "node:stream";
import test from "node:test";

const bancoDeTeste = process.env.FINNITUS_TEST_DATABASE_URL;

test("API de perfil e reinício financeiro", {
  skip: !bancoDeTeste && "Configure FINNITUS_TEST_DATABASE_URL com um banco de teste migrado.",
}, async (t) => {
  process.env.DATABASE_URL = bancoDeTeste;
  process.env.JWT_SECRET = randomUUID();
  process.env.CLOUDINARY_URL = "";
  process.env.CLOUDINARY_CLOUD_NAME = "";
  process.env.CLOUDINARY_API_KEY = "";
  process.env.CLOUDINARY_API_SECRET = "";

  const { default: app } = await import("../src/Servidor/app.js");
  const { prisma } = await import("../src/lib/prisma.js");
  const { cloudinary } = await import("../src/config/cloudinary.js");
  const { criarSessao } = await import("../src/services/sessao.service.js");
  const { default: sharp } = await import("sharp");

  const servidor = app.listen(0, "127.0.0.1");
  t.after(() => new Promise<void>((resolve, reject) => {
    servidor.close((erro) => erro ? reject(erro) : resolve());
  }));
  await once(servidor, "listening");
  const endereco = servidor.address();
  assert.ok(endereco && typeof endereco !== "string");
  const base = `http://127.0.0.1:${endereco.port}`;
  const ids: number[] = [];

  t.after(async () => {
    const where = { id_Usuario: { in: ids } };
    try {
      await prisma.$transaction([
        prisma.receita.deleteMany({ where }),
        prisma.despesa.deleteMany({ where }),
        prisma.divida.deleteMany({ where }),
        prisma.imprevisto.deleteMany({ where }),
        prisma.reservaFinanceira.deleteMany({ where }),
        prisma.categoriaPersonalizada.deleteMany({ where }),
        prisma.usuario.deleteMany({ where }),
      ]);
    } finally {
      await prisma.$disconnect();
    }
  });

  async function criarConta() {
    const usuario = await prisma.usuario.create({
      data: {
        Unome: "Perfil de teste",
        Uemail: `${randomUUID()}@teste.invalid`,
        Udata_cadastro: new Date(),
        UTipo: "usuario",
      },
    });
    ids.push(usuario.id_Usuario);
    const token = await prisma.$transaction((tx) =>
      criarSessao(tx, usuario.id_Usuario, usuario.tokenVersion, "Teste"),
    );
    return { id: usuario.id_Usuario, token, email: usuario.Uemail };
  }

  const conta = await criarConta();
  const outraConta = await criarConta();

  async function requisitar(caminho: string, esperado: number, opcoes: {
    metodo?: string;
    token?: string | null;
    json?: object;
    upload?: FormData;
  } = {}) {
    const token = opcoes.token === undefined ? conta.token : opcoes.token;
    const resposta = await fetch(`${base}${caminho}`, {
      method: opcoes.metodo,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(opcoes.json && { "Content-Type": "application/json" }),
      },
      body: opcoes.json ? JSON.stringify(opcoes.json) : opcoes.upload,
    });
    const corpo = await resposta.text();
    assert.equal(resposta.status, esperado, corpo);
    return corpo ? JSON.parse(corpo) : undefined;
  }

  await t.test("consulta e salva os dados do titular", async () => {
    assert.equal((await requisitar("/me", 200)).user.profileComplete, false);
    await requisitar("/me", 400, { metodo: "PATCH", json: { data_nasc: "2025-02-29" } });
    const dados = { name: "Pessoa Atualizada", telefone: "11999999999", data_nasc: "2000-02-29" };
    const { user } = await requisitar("/me", 200, { metodo: "PATCH", json: dados });
    assert.equal(user.name, dados.name);
    assert.equal(user.telefone, dados.telefone);
    assert.equal(user.data_nasc, "2000-02-29T00:00:00.000Z");
    assert.equal(user.email, conta.email);
    assert.equal(user.profileComplete, true);
    assert.deepEqual((await requisitar("/me", 200)).user, user);
  });

  const urlFoto = "https://res.cloudinary.example/foto.webp";
  const imagensRemovidas: string[] = [];
  await t.test("valida, armazena e consulta o upload de perfil", async (teste) => {
    assert.deepEqual(await requisitar("/me/foto", 200), { fotoPerfilUrl: null });

    const invalido = new FormData();
    invalido.append("foto", new Blob(["inválido"], { type: "image/png" }), "foto.png");
    await requisitar("/me/foto", 400, { metodo: "PATCH", upload: invalido });
    const arquivo = await sharp({
      create: { width: 2, height: 2, channels: 3, background: "#000000" },
    }).png().toBuffer();
    const upload = new FormData();
    upload.append("foto", new Blob([new Uint8Array(arquivo)], { type: "image/png" }), "foto.png");
    const indisponivel = await requisitar("/me/foto", 503, { metodo: "PATCH", upload });
    assert.match(indisponivel.error, /armazenamento de fotos/);

    cloudinary.config({ cloud_name: "teste", api_key: "teste", api_secret: "teste" });
    let falhar = false;
    teste.mock.method(cloudinary.uploader, "upload_stream", (_opcoes, callback) =>
      new Writable({
        write(dados, _codificacao, terminar) {
          assert.equal(dados.toString("ascii", 8, 12), "WEBP");
          terminar();
        },
        final(terminar) {
          if (falhar) callback(new Error("erro externo privado"));
          else callback(undefined, { secure_url: urlFoto, public_id: "foto-de-teste" });
          terminar();
        },
      }),
    );
    const atualizada = await requisitar("/me/foto", 200, { metodo: "PATCH", upload });
    assert.equal(atualizada.fotoPerfilUrl, urlFoto);
    falhar = true;
    const erro = await requisitar("/me/foto", 502, { metodo: "PATCH", upload });
    assert.equal(erro.error, "Não foi possível armazenar a foto.");
    assert.deepEqual(await requisitar("/me/foto", 200), { fotoPerfilUrl: urlFoto });
  });

  await t.test("grava o perfil financeiro em qualquer ordem e valida os campos", async () => {
    assert.deepEqual(await requisitar("/perfil-financeiro", 200), { perfil: null });
    await requisitar("/perfil-financeiro", 400, { metodo: "PUT" });
    await requisitar("/perfil-financeiro/reserva", 400, {
      metodo: "PATCH", json: { economia_futura: 1000, tempo_economia: 2_147_483_648 },
    });
    const { perfil: reserva } = await requisitar("/perfil-financeiro/reserva", 200, {
      metodo: "PATCH", json: { economia_futura: 500, tempo_economia: 5 },
    });
    assert.equal(Number(reserva.economia_futura), 500);
    assert.equal(Number(reserva.despesas_mensais), 0);
    const perfilInvalido = { renda_fixa: null, renda_variavel: 0, despesas_mensais: 100_000_000 };
    await requisitar("/perfil-financeiro", 400, { metodo: "PUT", json: perfilInvalido });
    await requisitar("/perfil-financeiro", 200, {
      metodo: "PUT", json: { renda_fixa: 2400.5, renda_variavel: null, despesas_mensais: 1250 },
    });
    const { perfil } = await requisitar("/perfil-financeiro", 200);
    assert.equal(Number(perfil.renda_fixa), 2400.5);
    assert.equal(perfil.renda_variavel, null);
    assert.equal(Number(perfil.despesas_mensais), 1250);
    assert.equal(Number(perfil.economia_futura), 500);
    assert.equal(perfil.tempo_economia, 5);
  });

  await t.test("reinicia somente os dados financeiros da conta autenticada", async (teste) => {
    const where = { id_Usuario: conta.id };
    const inicio = new Date("2026-09-10T14:00:00Z");
    const categoria = await prisma.categoriaPersonalizada.create({
      data: { ...where, nome: "Categoria teste", tipo: "DESPESA" },
    });
    const dadosDespesa = {
      descricao: "Conta de teste",
      valor: 60,
      data_vencimento: inicio,
      tipo: "VARIAVEL" as const,
      frequencia: "UNICA" as const,
    };
    const despesa = await prisma.despesa.create({
      data: { ...dadosDespesa, ...where, id_CategoriaPersonalizada: categoria.id_CategoriaPersonalizada },
    });
    await prisma.despesa.create({ data: { ...dadosDespesa, id_Usuario: outraConta.id } });
    await prisma.receita.create({
      data: { ...where, descricao: "Receita", valor: 100, tipo: "FIXA", frequencia: "MENSAL", data_recebimento: inicio },
    });
    await prisma.evento.createMany({
      data: [
        { ...where, data_inicio: inicio, Enome: "Compromisso pessoal" },
        { ...where, data_inicio: inicio, Enome: "Conta suspeita", status_financeiro: "SUSPEITO" },
        { ...where, data_inicio: inicio, Enome: "Conta vinculada", id_Despesa: despesa.id_Despesa },
      ],
    });
    await prisma.divida.create({
      data: {
        ...where,
        id_CategoriaPersonalizada: categoria.id_CategoriaPersonalizada,
        nome: "Dívida",
        valor_total: 60,
        valor_parcela: 20,
        quantidade_parcelas: 3,
        parcelas_restantes: 3,
        data_vencimento: inicio,
      },
    });
    await prisma.imprevisto.create({
      data: { ...where, Inome: "Teste Plano B", tipo: "OUTRO", Ivalor: 10, Idata: inicio },
    });
    const meta = await prisma.meta.create({
      data: {
        ...where,
        Mnome: "Meta de teste",
        Mvalor_objetivo: 100,
        Mtipo: "LONGO_PRAZO",
        MovimentacaoMeta: { create: { tipo: "APORTE", valor: 10 } },
      },
    });
    const reserva = await prisma.reservaFinanceira.create({
      data: { ...where, valor_atual: 20, movimentacoes: { create: { tipo: "DEPOSITO", valor: 20 } } },
    });
    await prisma.notificacao.create({
      data: {
        ...where, tipo: "DESPESA_CRIADA", titulo: "Teste", mensagem: "Teste da despesa", chaveEvento: "teste-reset",
      },
    });
    const configuracao = await requisitar("/me/configuracoes", 200, {
      metodo: "PATCH", json: { mostrarValores: false, metas: false },
    });

    const rota = "/me/dados-financeiros";
    const confirmacao = { confirmacao: "RECOMEÇAR", id_Usuario: outraConta.id };
    await requisitar(rota, 401, { metodo: "DELETE", token: null, json: confirmacao });
    await requisitar(rota, 400, { metodo: "DELETE", json: { confirmacao: "sim" } });
    assert.equal(await prisma.despesa.count({ where }), 1);
    await requisitar(rota, 204, { metodo: "DELETE", json: confirmacao });
    await requisitar(rota, 204, { metodo: "DELETE", json: confirmacao });

    assert.deepEqual(await Promise.all([
      prisma.receita.count({ where }),
      prisma.despesa.count({ where }),
      prisma.divida.count({ where }),
      prisma.meta.count({ where }),
      prisma.imprevisto.count({ where }),
      prisma.reservaFinanceira.count({ where }),
      prisma.categoriaPersonalizada.count({ where }),
      prisma.notificacao.count({ where }),
      prisma.movimentacaoMeta.count({ where: { id_Meta: meta.id_Meta } }),
      prisma.movimentacaoReserva.count({ where: { id_Reserva: reserva.id_Reserva } }),
    ]), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    assert.deepEqual(await prisma.evento.findMany({ where, select: { Enome: true } }), [
      { Enome: "Compromisso pessoal" },
    ]);
    assert.equal(await prisma.despesa.count({ where: { id_Usuario: outraConta.id } }), 1);
    assert.equal((await requisitar("/me", 200)).user.name, "Pessoa Atualizada");
    assert.deepEqual(await requisitar("/me/configuracoes", 200), configuracao);
    assert.deepEqual(await requisitar("/perfil-financeiro", 200), { perfil: null });
    assert.deepEqual(await requisitar("/me/foto", 200), { fotoPerfilUrl: urlFoto });

    teste.mock.method(cloudinary.uploader, "destroy", async (id: string) => {
      imagensRemovidas.push(id);
      return { result: "ok" };
    });
    assert.equal((await requisitar("/me/foto", 200, { metodo: "DELETE" })).fotoPerfilUrl, null);
    assert.deepEqual(await requisitar("/me/foto", 200), { fotoPerfilUrl: null });
    assert.deepEqual(imagensRemovidas, ["foto-de-teste"]);
  });
});
