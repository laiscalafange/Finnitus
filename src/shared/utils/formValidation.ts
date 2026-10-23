export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function validEmail(value: string) {
  return (
    value.length <= 100 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

export function validatePassword(
  value: string,
  confirmation: string
) {
  const bytes = encodeURIComponent(value)
    .replace(/%[A-F\d]{2}|./g, "x")
    .length;

  if (value.length < 8 || bytes > 72) {
    throw new Error(
      "A senha deve ter pelo menos 8 caracteres e no máximo 72 bytes."
    );
  }

  if (value !== confirmation) {
    throw new Error(
      "As senhas não coincidem."
    );
  }
}

// Máscara de telefone brasileiro: (11) 91234-5678 ou (11) 1234-5678.
// Os parênteses, o espaço e o hífen entram sozinhos enquanto digita.
export function mascararTelefone(texto: string) {
  const digitos = texto.replace(/\D/g, "").slice(0, 11);

  if (digitos.length === 0) {
    return "";
  }

  if (digitos.length <= 2) {
    return `(${digitos}`;
  }

  if (digitos.length <= 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }

  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }

  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function normalizePhone(value: string) {
  return value.replace(/[()\s-]/g, "");
}

export function validateProfile(
  name: string,
  telefone: string,
  data: string
) {
  const normalizedName = name.trim();

  if (
    normalizedName.length < 2 ||
    normalizedName.length > 100
  ) {
    throw new Error(
      "Informe um nome entre 2 e 100 caracteres."
    );
  }

  if (!/^\+?\d{8,14}$/.test(telefone)) {
    throw new Error(
      "Informe um telefone com 8 a 14 dígitos, com + opcional no início."
    );
  }

  const date = new Date(
    data + "T00:00:00.000Z"
  );

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== data ||
    date > new Date()
  ) {
    throw new Error(
      "Informe uma data de nascimento válida (DD/MM/AAAA), que não seja no futuro."
    );
  }
}