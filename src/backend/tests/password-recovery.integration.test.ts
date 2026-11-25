import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import test from "node:test";
import type { Request, Response as ExpressResponse } from "express";

const bancoDeTeste = process.env.FINNITUS_TEST_DATABASE_URL;

test("API de recuperação de senha", async (t) => {
  process.env.DATABASE_URL = bancoDeTeste ?? "postgresql://teste@127.0.0.1:1/teste";
  process.env.JWT_SECRET = randomUUID();
  process.env.BREVO_API_KEY = "";
  process.env.BREVO_SENDER_EMAIL = "";
  process.env.EMAIL_USER = "";
  process.env.EMAIL_PASSWORD = "";
  process.env.EMAIL_FROM = "";

  const { forgotPassword } = await import("../src/controllers/auth.controller.js");
  const { env } = await import("../src/config/env.js");
  const { prisma } = await import("../src/lib/prisma.js");

  await t.test("informa a indisponibilidade sem consultar a conta", async (teste) => {
    const consultar = prisma.usuario.findUnique;
    const consultaMock = teste.mock.fn(() => assert.fail("O banco não deveria ser consultado."));
    Reflect.set(prisma.usuario, "findUnique", consultaMock);
    teste.after(() => { Reflect.set(prisma.usuario, "findUnique", consultar); });

    const pedido = { body: { email: "conta@example.test" } } as Request;
    const json = teste.mock.fn((_corpo: { code: string }) => undefined);
    const resposta = {
      status: teste.mock.fn((_status: number) => ({ json })),
    };
    await forgotPassword(pedido, resposta as unknown as ExpressResponse);
    assert.equal(consultaMock.mock.callCount(), 0);
    assert.deepEqual(resposta.status.mock.calls[0]?.arguments, [503]);
    assert.equal(json.mock.calls[0]?.arguments[0].code, "PASSWORD_RECOVERY_UNAVAILABLE");
  });

  await t.test("envia o código por HTTPS e permite usar a nova senha", {
    skip: !bancoDeTeste && "Configure FINNITUS_TEST_DATABASE_URL com um banco de teste migrado.",
  }, async (teste) => {
    env.BREVO_API_KEY = "chave-de-teste";
    env.BREVO_SENDER_EMAIL = "finnitus@example.test";

    const { default: app } = await import("../src/Servidor/app.js");
    const servidor = app.listen(0, "127.0.0.1");
    teste.after(() => new Promise<void>((resolve, reject) => {
      servidor.close((erro) => erro ? reject(erro) : resolve());
    }));
    await once(servidor, "listening");
    const endereco = servidor.address();
    assert.ok(endereco && typeof endereco !== "string");

    const fetchLocal = globalThis.fetch;
    async function post(caminho: string, esperado: number, dados: object) {
      const resposta = await fetchLocal(`http://127.0.0.1:${endereco.port}/auth/${caminho}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const corpo = await resposta.text();
      assert.equal(resposta.status, esperado, corpo);
      return JSON.parse(corpo);
    }

    const email = `${randomUUID()}@example.test`;
    const emailComFalha = `${randomUUID()}@example.test`;
    const emails = [email, emailComFalha];
    teste.after(async () => {
      try {
        await prisma.usuario.deleteMany({ where: { Uemail: { in: emails } } });
      } finally {
        await prisma.$disconnect();
      }
    });
    await prisma.usuario.createMany({
      data: emails.map((Uemail) => ({
        Uemail, Unome: "Conta para redefinição", Udata_cadastro: new Date(), UTipo: "usuario",
      })),
    });

    let codigo: string | undefined;
    teste.mock.method(globalThis, "fetch", async (url: string, opcoes: RequestInit) => {
      assert.equal(url, "https://api.brevo.com/v3/smtp/email");
      const entrega = JSON.parse(String(opcoes.body));
      if (entrega.to[0].email === emailComFalha) {
        return new Response("{}", { status: 400 });
      }
      assert.deepEqual(entrega.to, [{ email }]);
      codigo = entrega.htmlContent.match(/\b\d{4}\b/)?.[0];
      return Response.json({ messageId: "teste" }, { status: 201 });
    });

    const resposta = await post("forgot-password", 200, { email });
    assert.ok(codigo);
    const falha = await post("forgot-password", 200, { email: emailComFalha });
    const inexistente = await post("forgot-password", 200, { email: "inexistente@example.test" });
    assert.deepEqual(falha, resposta);
    assert.deepEqual(inexistente, resposta);

    const { resetToken } = await post("verify-code", 200, { email, code: codigo });
    const novaSenha = "Senha de teste 123";
    await post("reset-password", 200, { resetToken, newPassword: novaSenha });
    await post("reset-password", 400, { resetToken, newPassword: novaSenha });
    const login = await post("login", 200, {
      email, password: novaSenha, maiorDeIdade: true, leuTermos: true,
    });
    assert.equal(login.user.email, email);
  });
});
