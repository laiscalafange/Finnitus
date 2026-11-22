import { HttpError } from "../utils/errors.js";

const FONTE_COTACAO = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
const UMA_HORA = 60 * 60 * 1000;
const IDADE_MAXIMA = 7 * 24 * UMA_HORA;

type Cotacao = {
  data: string;
  taxas: { USD: number; EUR: number };
};

let ultimaCotacao: Cotacao | undefined;
let proximaConsulta = 0;
let consultaEmAndamento: Promise<void> | undefined;

function cotacaoRecente(data: string, agora: number) {
  const instante = new Date(`${data}T00:00:00Z`);
  const timestamp = instante.getTime();
  return Number.isFinite(timestamp) && instante.toISOString().slice(0, 10) === data &&
    timestamp <= agora && agora - timestamp < IDADE_MAXIMA;
}

function lerCotacao(xml: string, agora: number): Cotacao | undefined {
  const data = /<Cube\s+time=["'](\d{4}-\d{2}-\d{2})["']\s*>/.exec(xml)?.[1];
  const brl = Number(/<Cube\s+currency=["']BRL["']\s+rate=["']([\d.]+)["']/.exec(xml)?.[1]);
  const usd = Number(/<Cube\s+currency=["']USD["']\s+rate=["']([\d.]+)["']/.exec(xml)?.[1]);
  if (!data || !cotacaoRecente(data, agora) || !Number.isFinite(brl) || brl <= 0 ||
    !Number.isFinite(usd) || usd <= 0) return;

  // O boletim tem o euro como base. A interface precisa de unidades por real.
  const taxas = { USD: usd / brl, EUR: 1 / brl };
  if (Object.values(taxas).some(taxa => !Number.isFinite(taxa) || taxa <= 0)) return;
  return { data, taxas };
}

async function atualizarCotacao(): Promise<void> {
  try {
    const resposta = await fetch(FONTE_COTACAO, { signal: AbortSignal.timeout(5_000) });
    if (resposta.ok) {
      const dados = lerCotacao(await resposta.text(), Date.now());
      if (dados) {
        ultimaCotacao = dados;
        proximaConsulta = Date.now() + UMA_HORA;
        return;
      }
    }
  } catch {
    // Uma falha transitória ainda permite usar a última cotação recente.
  }
  proximaConsulta = Date.now() + 60_000;
}

export async function buscarCotacao(): Promise<Cotacao> {
  if (Date.now() >= proximaConsulta) {
    consultaEmAndamento ??= atualizarCotacao().finally(() => { consultaEmAndamento = undefined; });
    await consultaEmAndamento;
  }
  if (ultimaCotacao && cotacaoRecente(ultimaCotacao.data, Date.now())) return ultimaCotacao;
  throw new HttpError(503, "Cotação indisponível no momento.");
}
