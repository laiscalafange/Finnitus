import { HttpError } from "./errors.js";

export function objectBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, "Envie um objeto JSON.");
  }

  return value as Record<string, unknown>;
}

export function text(
  value: unknown,
  label: string,
  min = 1,
  max = 100,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max
  ) {
    throw new HttpError(
      400,
      `${label}: informe um texto entre ${min} e ${max} caracteres.`,
    );
  }

  return value.trim();
}

export function emailValue(value: unknown): string {
  const email = text(value, "email", 3, 100).toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "E-mail inválido.");
  }

  return email;
}

export function password(value: unknown, isNew = true): string {
  // Espaços podem fazer parte da senha: não aplicar trim.
  if (
    typeof value !== "string" ||
    value.length < (isNew ? 8 : 1) ||
    Buffer.byteLength(value, "utf8") > 72
  ) {
    throw new HttpError(
      400,
      isNew
        ? "Senha: mínimo de 8 caracteres e máximo de 72 bytes."
        : "Senha inválida.",
    );
  }

  return value;
}

export function birthDate(value: unknown): Date {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    throw new HttpError(400, "data_nasc deve usar AAAA-MM-DD.");
  }

  const date = new Date(value + "T00:00:00.000Z");

  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value ||
    date > new Date()
  ) {
    throw new HttpError(400, "Data de nascimento inválida.");
  }

  return date;
}

export function phone(value: unknown): string {
  const result = text(value, "telefone", 8, 15);

  if (!/^\+?\d{8,14}$/.test(result)) {
    throw new HttpError(
      400,
      "Telefone: use apenas números e, opcionalmente, + no início (até 15 caracteres).",
    );
  }

  return result;
}