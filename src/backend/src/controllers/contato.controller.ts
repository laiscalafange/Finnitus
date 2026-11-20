import type { Request, Response } from "express";

import { env } from "../config/env.js";
import { sendEmail } from "../services/emailService.js";
import { getUserById } from "../services/user.service.js";
import { HttpError } from "../utils/errors.js";
import { objectBody, text } from "../utils/validation.js";

export async function enviarContato(req: Request, res: Response) {
  if (!req.userId) {
    throw new HttpError(401, "Não autorizado.");
  }

  const body = objectBody(req.body);
  const assunto = text(body.assunto, "Assunto", 1, 120);
  const mensagem = text(body.mensagem, "Mensagem", 1, 2000);

  if (!env.CONTACT_EMAIL) {
    res.status(503).json({ error: "O formulário de contato está indisponível." });
    return;
  }

  const usuario = await getUserById(req.userId);
  await sendEmail({
    to: env.CONTACT_EMAIL,
    replyTo: { address: usuario.email, name: "" },
    subject: "Finnitus — Nova mensagem de contato",
    text: `De: ${usuario.name} <${usuario.email}>\nAssunto: ${assunto}\n\n${mensagem}`,
  });

  res.status(204).end();
}
