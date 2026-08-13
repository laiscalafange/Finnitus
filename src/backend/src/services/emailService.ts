import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import { env } from "../config/env.js";

let transporter: Transporter | null = null;

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

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  const activeTransporter = getTransporter();

  await activeTransporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}