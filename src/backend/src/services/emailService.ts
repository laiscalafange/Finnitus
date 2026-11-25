import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import { env } from "../config/env.js";

let transporter: Transporter | null = null;

function usaBrevo() {
  return Boolean(env.BREVO_API_KEY || env.BREVO_SENDER_EMAIL);
}

export function invalidEmailSettings() {
  const valid = usaBrevo() ? {
    BREVO_API_KEY: Boolean(env.BREVO_API_KEY),
    BREVO_SENDER_EMAIL: /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(env.BREVO_SENDER_EMAIL),
  } : {
    EMAIL_HOST: Boolean(env.EMAIL_HOST.trim()),
    EMAIL_PORT: Number.isInteger(env.EMAIL_PORT) && env.EMAIL_PORT > 0 && env.EMAIL_PORT <= 65535,
    EMAIL_USER: Boolean(env.EMAIL_USER.trim()),
    EMAIL_PASSWORD: Boolean(env.EMAIL_PASSWORD.trim()),
    EMAIL_FROM: Boolean(env.EMAIL_FROM.trim()),
  };

  return Object.entries(valid)
    .filter(([, isValid]) => !isValid)
    .map(([setting]) => setting);
}

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: env.EMAIL_SECURE,

      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }

  return transporter;
}

type SendEmailParams = {
  to: string;
  subject: string;
  replyTo?: { address: string; name: string };
} & ({ html: string; text?: string } | { text: string; html?: string });

class BrevoDeliveryError extends Error {
  readonly code = "EBREVO";

  constructor(readonly responseCode?: number) {
    super("Falha no envio de e-mail pela API Brevo.");
  }
}

async function sendWithBrevo(message: SendEmailParams) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { email: env.BREVO_SENDER_EMAIL, name: "Finnitus" },
      to: [{ email: message.to }],
      replyTo: message.replyTo && {
        email: message.replyTo.address,
        name: message.replyTo.name || undefined,
      },
      subject: message.subject,
      htmlContent: message.html,
      textContent: message.text,
    }),
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  }).catch(() => {
    throw new BrevoDeliveryError();
  });

  // Libera a conexão sem usar o conteúdo retornado pelo provedor.
  void response.body?.cancel().catch(() => undefined);
  if (!response.ok) {
    throw new BrevoDeliveryError(response.status);
  }
}

export async function sendEmail(message: SendEmailParams): Promise<void> {
  if (invalidEmailSettings().length > 0) {
    throw new Error("Envio de e-mail não configurado.");
  }

  if (usaBrevo()) {
    await sendWithBrevo(message);
    return;
  }

  const activeTransporter = getTransporter();

  await activeTransporter.sendMail({
    ...message,
    from: env.EMAIL_FROM,
  });
}

export async function sendPasswordResetCodeEmail(
  to: string,
  codigo: string
): Promise<void> {
  await sendEmail({
    to,
    subject: "Finnitus — Código de recuperação de senha",

    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Recuperação de senha</h2>

        <p>
          Use o código abaixo para redefinir sua senha no Finnitus:
        </p>

        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">
          ${codigo}
        </p>

        <p>
          Esse código expira em 15 minutos.
          Se você não solicitou essa recuperação, ignore este e-mail.
        </p>
      </div>
    `,
  });
}
