import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import { env } from "../config/env.js";

let transporter: Transporter | null = null;

export function invalidEmailSettings() {
  const valid = {
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
  if (invalidEmailSettings().length > 0) {
    throw new Error("SMTP não configurado.");
  }

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

export async function sendEmail(message: SendEmailParams): Promise<void> {
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
