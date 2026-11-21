import type { Request, Response } from "express";

import { env } from "../config/env.js";
import { invalidEmailSettings, sendEmail } from "../services/emailService.js";
import { getUserById } from "../services/user.service.js";
import { HttpError } from "../utils/errors.js";
import { objectBody, text } from "../utils/validation.js";

const codigosSmtp = new Set([
  "EAUTH", "ECONNECTION", "ECONNREFUSED", "ECONNRESET", "EDNS",
  "EENVELOPE", "EMESSAGE", "ESOCKET", "ETIMEDOUT", "ETLS",
]);

export async function enviarContato(req: Request, res: Response) {
  if (!req.userId) {
    throw new HttpError(401, "Não autorizado.");
  }

  const body = objectBody(req.body);
  const assunto = text(body.assunto, "Assunto", 1, 120);
  const mensagem = text(body.mensagem, "Mensagem", 1, 2000);

  const configuracoesInvalidas = invalidEmailSettings();
  if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(env.CONTACT_EMAIL)) {
    configuracoesInvalidas.push("CONTACT_EMAIL");
  }
  if (configuracoesInvalidas.length > 0) {
    console.warn("Contate-nos: configuração incompleta ou inválida.", {
      variaveis: configuracoesInvalidas,
    });
    res.status(503).json({
      code: "CONTACT_NOT_CONFIGURED",
      error: "O formulário de contato ainda não está disponível.",
    });
    return;
  }

  const usuario = await getUserById(req.userId);
  try {
    await sendEmail({
      to: env.CONTACT_EMAIL,
      replyTo: { address: usuario.email, name: "" },
      subject: "Finnitus — Nova mensagem de contato",
      text: `De: ${usuario.name} <${usuario.email}>\nAssunto: ${assunto}\n\n${mensagem}`,
    });
  } catch (cause) {
    const smtp = cause as { code?: unknown; responseCode?: unknown } | null;
    const codigo = smtp?.code;
    const status = smtp?.responseCode;
    console.error("Contate-nos: falha no envio SMTP.", {
      codigo: typeof codigo === "string" && codigosSmtp.has(codigo) ? codigo : undefined,
      status: typeof status === "number" && Number.isInteger(status) && status >= 400 && status < 600
        ? status
        : undefined,
    });
    res.status(503).json({
      code: "CONTACT_DELIVERY_FAILED",
      error: "O serviço de e-mail está indisponível no momento. Tente enviar novamente mais tarde.",
    });
    return;
  }

  res.status(204).end();
}
