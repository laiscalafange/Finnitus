import argon2 from "argon2";
import { randomInt } from "node:crypto";

export function gerarCodigo(): string {
  return randomInt(10000)
    .toString()
    .padStart(4, "0");
}

export async function gerarHashCodigo(codigo: string) {
  return argon2.hash(codigo, {
    type: argon2.argon2id,
  });
}

export async function compararCodigo(
  codigo: string,
  hash: string,
) {
  return argon2.verify(hash, codigo);
}