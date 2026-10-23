// Utilitários de valor e data das telas do botão "+"

// Máximo de dígitos aceitos num valor (12 dígitos = até R$ 9.999.999.999,99)
const LIMITE_DIGITOS_VALOR = 12;

// 123456 (centavos) -> "1.234,56"
export function formatarCentavos(centavos: number): string {
  const texto = String(centavos).padStart(3, "0");
  const inteiro = texto.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimal = texto.slice(-2);

  return `${inteiro},${decimal}`;
}

// Máscara de moeda para os campos de valor: a pessoa digita só números e o
// campo vai formando os centavos ("1" -> "0,01", "150" -> "1,50").
// Campo vazio continua vazio (aparece o placeholder "0,00").
export function mascararMoeda(texto: string): string {
  const digitos = texto.replace(/\D/g, "").slice(0, LIMITE_DIGITOS_VALOR);

  if (!digitos) {
    return "";
  }

  return formatarCentavos(Number(digitos));
}

// "1.234,56" -> 1234.56 (campo vazio vira 0)
export function moedaParaNumero(texto: string): number {
  const digitos = texto.replace(/\D/g, "");

  return digitos ? Number(digitos) / 100 : 0;
}

// 850 -> "R$ 850,00"
export function formatarMoeda(valor: number): string {
  return `R$ ${formatarCentavos(Math.round(valor * 100))}`;
}

// Máscara de data DD/MM/AAAA (a barra entra sozinha enquanto digita)
export function mascararData(texto: string): string {
  const digitos = texto.replace(/\D/g, "").slice(0, 8);

  if (digitos.length <= 2) {
    return digitos;
  }

  if (digitos.length <= 4) {
    return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  }

  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

// Confere se o texto é uma data real (ex.: 31/02/2026 é inválida)
export function dataValida(texto: string): boolean {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);

  if (!partes) {
    return false;
  }

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);
  const data = new Date(ano, mes - 1, dia);

  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia
  );
}

// true se a data (DD/MM/AAAA, já validada) é anterior a hoje
export function dataEhPassada(texto: string): boolean {
  const [dia, mes, ano] = texto.split("/").map(Number);
  const data = new Date(ano, mes - 1, dia);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return data < hoje;
}

// "2026-10-18" (API) -> "18/10/2026" (tela). Texto fora do padrão vira "".
export function isoParaBr(iso: string): string {
  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);

  return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : "";
}

// "18/10/2026" (tela) -> "2026-10-18" (API)
export function brParaIso(br: string): string {
  const [dia, mes, ano] = br.split("/");

  return `${ano}-${mes}-${dia}`;
}

// Data de hoje no formato DD/MM/AAAA
export function hojeFormatado(): string {
  const hoje = new Date();

  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");

  return `${dia}/${mes}/${hoje.getFullYear()}`;
}