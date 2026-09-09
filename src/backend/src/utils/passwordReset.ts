import argon2 from "argon2";

export function gerarCodigo(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function gerarHashCodigo(codigo: string): Promise<string> {
  return await argon2.hash(codigo);
}

export async function compararCodigo(
  codigo: string,
  codigoHash: string
): Promise<boolean> {
  return await argon2.verify(codigoHash, codigo);
}