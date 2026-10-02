// Utilitários das telas de Pagamento: máscaras e validações do cartão
// e formatação de data por extenso.

// "1234567812345678" -> "1234 5678 1234 5678"
export function mascararNumeroCartao(texto: string): string {
  const digitos = texto.replace(/\D/g, "").slice(0, 16);

  return digitos.replace(/(\d{4})(?=\d)/g, "$1 ");
}

// "1228" -> "12/28" (a barra entra sozinha enquanto digita)
export function mascararValidade(texto: string): string {
  const digitos = texto.replace(/\D/g, "").slice(0, 4);

  if (digitos.length <= 2) {
    return digitos;
  }

  return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
}

// Só números, até 4 dígitos (alguns cartões têm CVV de 4)
export function mascararCvv(texto: string): string {
  return texto.replace(/\D/g, "").slice(0, 4);
}

// Confere o número do cartão: 16 dígitos e dígito verificador (algoritmo de Luhn)
export function numeroCartaoValido(texto: string): boolean {
  const digitos = texto.replace(/\D/g, "");

  if (digitos.length !== 16) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < digitos.length; i++) {
    let numero = Number(digitos[digitos.length - 1 - i]);

    if (i % 2 === 1) {
      numero *= 2;
      if (numero > 9) numero -= 9;
    }

    soma += numero;
  }

  return soma % 10 === 0;
}

// Confere MM/AA: mês entre 01 e 12 e cartão ainda não vencido
export function validadeValida(texto: string): boolean {
  const partes = /^(\d{2})\/(\d{2})$/.exec(texto);

  if (!partes) {
    return false;
  }

  const mes = Number(partes[1]);
  const ano = 2000 + Number(partes[2]);

  if (mes < 1 || mes > 12) {
    return false;
  }

  const hoje = new Date();
  const mesAtual = hoje.getFullYear() * 12 + hoje.getMonth();

  // O cartão vale até o fim do mês da validade
  return ano * 12 + (mes - 1) >= mesAtual;
}

export function cvvValido(texto: string): boolean {
  return /^\d{3,4}$/.test(texto);
}

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

// Date -> "26 de julho de 2025"
export function formatarDataExtenso(data: Date): string {
  return `${data.getDate()} de ${MESES[data.getMonth()]} de ${data.getFullYear()}`;
}

// Devolve uma nova data com N dias a mais
export function somarDias(data: Date, dias: number): Date {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + dias);

  return nova;
}