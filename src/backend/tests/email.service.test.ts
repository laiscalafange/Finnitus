import assert from "node:assert/strict";
import test from "node:test";

test("envio de e-mail pelo Brevo", async (t) => {
  process.env.DATABASE_URL = "postgresql://teste:teste@127.0.0.1:5432/finnitus";
  process.env.JWT_SECRET = "segredo-local-do-teste-de-envio-de-email";
  process.env.BREVO_API_KEY = "chave-ficticia";
  process.env.BREVO_SENDER_EMAIL = "envio@example.test";

  const { env } = await import("../src/config/env.js");
  const { invalidEmailSettings, sendEmail, sendPasswordResetCodeEmail } =
    await import("../src/services/emailService.js");

  await t.test("prepara mensagem de contato e código de recuperação", async (t) => {
    const mensagens: Record<string, unknown>[] = [];
    const envio = t.mock.method(globalThis, "fetch", async (url, opcoes) => {
      assert.equal(url, "https://api.brevo.com/v3/smtp/email");
      assert.equal(opcoes?.method, "POST");
      assert.equal(new Headers(opcoes?.headers).get("api-key"), "chave-ficticia");
      assert.equal(opcoes?.redirect, "error");
      assert.ok(opcoes?.signal);
      mensagens.push(JSON.parse(String(opcoes?.body)));
      return new Response(JSON.stringify({ messageId: "teste" }), { status: 201 });
    });

    assert.deepEqual(invalidEmailSettings(), []);
    await sendEmail({
      to: "suporte@example.test",
      replyTo: { address: "usuario@example.test", name: "" },
      subject: "Contato",
      text: "Mensagem para o suporte",
    });
    assert.deepEqual(mensagens[0], {
      sender: { email: "envio@example.test", name: "Finnitus" },
      to: [{ email: "suporte@example.test" }],
      replyTo: { email: "usuario@example.test" },
      subject: "Contato",
      textContent: "Mensagem para o suporte",
    });

    await sendPasswordResetCodeEmail("usuario@example.test", "124321");
    assert.deepEqual(mensagens[1]?.to, [{ email: "usuario@example.test" }]);
    assert.match(String(mensagens[1]?.htmlContent), /124321/u);
    assert.equal(envio.mock.callCount(), 2);
  });

  await t.test("sinaliza falhas sem propagar dados retornados pelo provedor", async (t) => {
    t.mock.method(globalThis, "fetch", async () => new Response("dados privados", { status: 401 }));

    await assert.rejects(sendPasswordResetCodeEmail("usuario@example.test", "124321"), {
      code: "EBREVO",
      responseCode: 401,
      message: "Falha no envio de e-mail pela API Brevo.",
    });
  });

  await t.test("identifica configuração parcial antes de abrir conexão", async (t) => {
    const envio = t.mock.method(globalThis, "fetch", async () => {
      throw new Error("A configuração parcial não deve fazer requisições.");
    });
    env.BREVO_SENDER_EMAIL = "";

    assert.deepEqual(invalidEmailSettings(), ["BREVO_SENDER_EMAIL"]);
    await assert.rejects(sendPasswordResetCodeEmail("usuario@example.test", "124321"), {
      message: "Envio de e-mail não configurado.",
    });
    assert.equal(envio.mock.callCount(), 0);
  });

  await t.test("continua usando SMTP sem configuração do Brevo", async (t) => {
    const { default: nodemailer } = await import("nodemailer");
    env.BREVO_API_KEY = "";
    env.BREVO_SENDER_EMAIL = "";
    env.EMAIL_HOST = "smtp.example.test";
    env.EMAIL_PORT = 465;
    env.EMAIL_SECURE = true;
    env.EMAIL_USER = "envio@example.test";
    env.EMAIL_PASSWORD = "senha-ficticia";
    env.EMAIL_FROM = "Finnitus <envio@example.test>";

    const mensagens: unknown[] = [];
    const criarTransporte = t.mock.method(nodemailer, "createTransport", (opcoes) => {
      assert.deepEqual(opcoes, {
        host: "smtp.example.test",
        port: 465,
        secure: true,
        auth: { user: "envio@example.test", pass: "senha-ficticia" },
      });
      return {
        async sendMail(mensagem: unknown) {
          mensagens.push(mensagem);
        },
      };
    });

    assert.deepEqual(invalidEmailSettings(), []);
    await sendEmail({ to: "usuario@example.test", subject: "Teste", text: "Mensagem" });
    assert.deepEqual(mensagens, [{
      to: "usuario@example.test",
      subject: "Teste",
      text: "Mensagem",
      from: "Finnitus <envio@example.test>",
    }]);
    assert.equal(criarTransporte.mock.callCount(), 1);
  });
});
