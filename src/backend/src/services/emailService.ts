import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import { env } from "../config/env.js";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (
    !env.EMAIL_USER ||
    !env.EMAIL_PASSWORD ||
    !env.EMAIL_FROM
  ) {
    throw new Error("SMTP não configurado.");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: Number(env.EMAIL_PORT),
      secure: env.EMAIL_SECURE,

      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }

  return transporter;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams): Promise<void> {
  const activeTransporter = getTransporter();

  await activeTransporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
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