
import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import { api } from "./api";
import {
  brParaIso,
  isoParaBr,
} from "@/features/menuMais/utils";



// =====================================================================
// Serviço do Plano B (imprevistos + análise da IA)
//
// Usa as rotas que o backend já tem:
//   GET    /imprevistos          lista
//   GET    /imprevistos/:id      um imprevisto
//   PUT    /imprevistos/:id      edita (também grava a estratégia escolhida)
//   DELETE /imprevistos/:id      exclui
//   POST   /plano-b              análise da IA (Gemini)
//
// ATENÇÃO (comportamento atual do backend):
//  - POST /plano-b JÁ GRAVA o imprevisto no banco quando a análise termina.
//    Por isso as funções abaixo reaproveitam essa linha como o imprevisto do
//    histórico e apagam as linhas "temporárias" criadas por reanálises.
//  - A resposta da IA é um TEXTO livre (campo "resposta"), não uma lista de
//    estratégias. As estratégias com impacto financeiro são calculadas aqui
//    mesmo (veja "ESTRATÉGIAS CALCULADAS NO APP") até o backend devolver isso
//    estruturado.
//  - O banco não tem campo de status nem guarda a análise. O status
//    "resolvido" e a análise ficam só neste aparelho (veja "DADOS LOCAIS").
// =====================================================================

// A análise chama o Gemini e pode passar dos 15s padrão do axios
const TEMPO_ANALISE_MS = 90000;

// ---------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------

export type TipoImprevisto =
  | "PERDA_RENDA"
  | "AUMENTO_DESPESA"
  | "DESPESA_INESPERADA"
  | "OUTRO";

export type StatusImprevisto = "pendente" | "andamento" | "resolvido";

export const ROTULOS_TIPO: Record<TipoImprevisto, string> = {
  PERDA_RENDA: "Perda de renda",
  AUMENTO_DESPESA: "Aumento de despesa",
  DESPESA_INESPERADA: "Despesa inesperada",
  OUTRO: "Outro",
};

export const ROTULOS_STATUS: Record<StatusImprevisto, string> = {
  pendente: "Pendente",
  andamento: "Em andamento",
  resolvido: "Resolvido",
};

// Tipo detalhado escolhido na tela (ex.: "Saúde" ou um tipo criado pela
// pessoa). O backend só aceita os 4 tipos acima, então tudo que não é um dos
// 3 primeiros vai como "OUTRO" e o detalhe fica guardado no aparelho.
export type TipoDetalhe = {
  id: string;
  rotulo: string;
};

// Linha como o backend devolve (Prisma). Decimal chega como texto.
type ImprevistoApi = {
  id_Imprevisto: number;
  Inome: string;
  tipo: TipoImprevisto;
  Ivalor: number | string;
  Idata: string;
  duracao_meses: number | null;
  solucao_escolhida: string | null;
  Idescricao: string | null;
};

// Imprevisto como o app usa
export type Imprevisto = {
  id: string;
  nome: string;
  tipo: TipoImprevisto;
  // Só existe quando o tipo é "OUTRO" com um detalhe (veja TipoDetalhe)
  tipoDetalhe?: TipoDetalhe;
  valor: number;
  // DD/MM/AAAA
  data: string;
  duracaoMeses?: number;
  descricao: string;
  // Título da estratégia escolhida (vem de "solucao_escolhida")
  estrategia?: string;
  status: StatusImprevisto;
};

// Dados do formulário já validados
export type DadosImprevisto = {
  nome: string;
  tipo: TipoImprevisto;
  tipoDetalhe?: TipoDetalhe;
  valor: number;
  // DD/MM/AAAA
  data: string;
  duracaoMeses?: number;
  descricao: string;
};

export type SituacaoFinanceira = {
  rendaMensal: number;
  despesasMensais: number;
  dividasMensais: number;
  reservaFinanceira: number;
  saldoMensal: number;
};

export type Impacto = {
  rotulo: string;
  valor: string;
  tom?: "positivo" | "alerta" | "neutro";
};

export type Estrategia = {
  id: string;
  titulo: string;
  descricao: string;
  impactos: Impacto[];
};

export type Analise = {
  // Texto da IA, já sem marcações de markdown
  texto: string;
  situacao: SituacaoFinanceira;
  estrategias: Estrategia[];
};

export type ResultadoAnalise = {
  imprevisto: Imprevisto;
  analise: Analise;
};

type EstrategiaGeminiApi = {
  titulo: string;
  descricao: string;
  justificativa: string;
  riscos: string[];
  vantagens: string[];
};

type RespostaPlanoB = {
  situacaoFinanceira: SituacaoFinanceira;
  imprevisto: ImprevistoApi;
  resposta: string;
  prioridades: string[];
  estrategias: EstrategiaGeminiApi[];
  analiseEstruturada: boolean;
};

// ---------------------------------------------------------------------
// DADOS LOCAIS (só neste aparelho)
// TODO (backend): quando o banco ganhar status e guardar a análise/estratégias,
// apagar esta seção e ler tudo da API.
// ---------------------------------------------------------------------

// Análise de cada imprevisto (some ao fechar o app; dá pra pedir de novo)
const analises = new Map<string, Analise>();

// Ids marcados como resolvidos (guardados no aparelho, são poucos ids)
const CHAVE_RESOLVIDOS = "finnitus.imprevistos.resolvidos.v1";
let resolvidos: Promise<Set<string>> | null = null;

// A leitura acontece uma única vez; chamadas simultâneas esperam o mesmo resultado
function lerResolvidos(): Promise<Set<string>> {
  if (!resolvidos) {
    resolvidos = (async () => {
      const conjunto = new Set<string>();

      if (Platform.OS === "web") {
        return conjunto;
      }

      try {
        const bruto = await SecureStore.getItemAsync(CHAVE_RESOLVIDOS);
        const lista: unknown = bruto ? JSON.parse(bruto) : [];

        if (Array.isArray(lista)) {
          lista.forEach((item) => conjunto.add(String(item)));
        }
      } catch {
        // Sem armazenamento: o status resolvido vale só até fechar o app
      }

      return conjunto;
    })();
  }

  return resolvidos;
}

async function salvarResolvidos(conjunto: Set<string>): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  try {
    await SecureStore.setItemAsync(
      CHAVE_RESOLVIDOS,
      JSON.stringify(Array.from(conjunto)),
    );
  } catch {
    // Best effort: o app continua funcionando
  }
}

// Leitura/gravação simples de JSON no armazenamento seguro do aparelho
async function lerJson<T>(chave: string, padrao: T): Promise<T> {
  if (Platform.OS === "web") {
    return padrao;
  }

  try {
    const bruto = await SecureStore.getItemAsync(chave);

    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

async function gravarJson(chave: string, valor: unknown): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  try {
    await SecureStore.setItemAsync(chave, JSON.stringify(valor));
  } catch {
    // Best effort: o app continua funcionando
  }
}

// Tipo detalhado de cada imprevisto: { idDoImprevisto: [idDoTipo, nome] }
const CHAVE_TIPOS = "finnitus.imprevistos.tipos.v1";
let tiposGuardados: Promise<Record<string, [string, string]>> | null = null;

function lerTipos(): Promise<Record<string, [string, string]>> {
  if (!tiposGuardados) {
    tiposGuardados = lerJson<Record<string, [string, string]>>(
      CHAVE_TIPOS,
      {},
    ).then((valor) =>
      valor !== null && typeof valor === "object" && !Array.isArray(valor)
        ? valor
        : {},
    );
  }

  return tiposGuardados;
}

async function definirTipo(id: string, detalhe?: TipoDetalhe): Promise<void> {
  const tipos = await lerTipos();

  if (detalhe) {
    tipos[id] = [detalhe.id, detalhe.rotulo];
  } else {
    delete tipos[id];
  }

  await gravarJson(CHAVE_TIPOS, tipos);
}

// Tipos de imprevisto criados pela pessoa (aparecem no modal "Outros")
const CHAVE_CRIADOS = "finnitus.imprevistos.criados.v1";
let tiposCriados: Promise<TipoDetalhe[]> | null = null;

export function carregarTiposCriados(): Promise<TipoDetalhe[]> {
  if (!tiposCriados) {
    tiposCriados = lerJson<[string, string][]>(CHAVE_CRIADOS, []).then(
      (lista) =>
        Array.isArray(lista)
          ? lista
              .filter(
                (item) =>
                  Array.isArray(item) &&
                  typeof item[0] === "string" &&
                  typeof item[1] === "string",
              )
              .map(([id, rotulo]) => ({ id, rotulo }))
          : [],
    );
  }

  return tiposCriados;
}

export async function salvarTipoCriado(tipo: TipoDetalhe): Promise<void> {
  const lista = await carregarTiposCriados();

  if (!lista.some((item) => item.id === tipo.id)) {
    lista.push(tipo);
  }

  await gravarJson(
    CHAVE_CRIADOS,
    lista.map((item) => [item.id, item.rotulo]),
  );
}

type DadosLocais = {
  resolvidos: Set<string>;
  tipos: Record<string, [string, string]>;
};

async function lerLocal(): Promise<DadosLocais> {
  const [conjunto, tipos] = await Promise.all([lerResolvidos(), lerTipos()]);

  return { resolvidos: conjunto, tipos };
}

export function analiseEmCache(id: string): Analise | null {
  return analises.get(id) ?? null;
}

// ---------------------------------------------------------------------
// Conversões
// ---------------------------------------------------------------------

function paraImprevisto(linha: ImprevistoApi, local: DadosLocais): Imprevisto {
  const id = String(linha.id_Imprevisto);
  const estrategia = linha.solucao_escolhida?.trim() || undefined;
  const detalhe = local.tipos[id];

  return {
    id,
    nome: linha.Inome,
    tipo: linha.tipo,
    tipoDetalhe:
      linha.tipo === "OUTRO" && detalhe
        ? { id: detalhe[0], rotulo: detalhe[1] }
        : undefined,
    valor: Number(linha.Ivalor),
    data: isoParaBr(linha.Idata),
    duracaoMeses: linha.duracao_meses ?? undefined,
    descricao: linha.Idescricao ?? "",
    estrategia,
    status: local.resolvidos.has(id)
      ? "resolvido"
      : estrategia
        ? "andamento"
        : "pendente",
  };
}

function corpo(dados: DadosImprevisto) {
  return {
    Inome: dados.nome.trim(),
    tipo: dados.tipo,
    Ivalor: dados.valor,
    Idata: brParaIso(dados.data),
    duracao_meses: dados.duracaoMeses ?? null,
    Idescricao: dados.descricao.trim() || null,
  };
}

// Nome do tipo para mostrar na tela ("Saúde", "Perda de renda"...)
export function rotuloTipoImprevisto(imprevisto: Imprevisto): string {
  return imprevisto.tipoDetalhe?.rotulo ?? ROTULOS_TIPO[imprevisto.tipo];
}

// Volta os dados de um imprevisto salvo para o formato do formulário
export function dadosDoImprevisto(imprevisto: Imprevisto): DadosImprevisto {
  return {
    nome: imprevisto.nome,
    tipo: imprevisto.tipo,
    tipoDetalhe: imprevisto.tipoDetalhe,
    valor: imprevisto.valor,
    data: imprevisto.data,
    duracaoMeses: imprevisto.duracaoMeses,
    descricao: imprevisto.descricao,
  };
}

// Uma edição "muda o problema" quando troca o tipo, a duração ou mexe 20% ou
// mais no valor. Nesses casos a tela oferece uma nova análise.
export function mudancaSignificativa(
  antes: Imprevisto,
  depois: Imprevisto,
): boolean {
  const variacao =
    antes.valor > 0 ? Math.abs(depois.valor - antes.valor) / antes.valor : 1;

  return (
    antes.tipo !== depois.tipo ||
    antes.tipoDetalhe?.id !== depois.tipoDetalhe?.id ||
    antes.duracaoMeses !== depois.duracaoMeses ||
    variacao >= 0.2
  );
}

// Mensagem de erro legível (o backend responde com o campo "mensagem")
export function mensagemErroImprevisto(erro: unknown): string {
  if (axios.isAxiosError(erro)) {
    const dados: unknown = erro.response?.data;

    if (dados !== null && typeof dados === "object") {
      const campos = dados as Record<string, unknown>;

      if (typeof campos.mensagem === "string") {
        return campos.mensagem;
      }

      if (typeof campos.error === "string") {
        return campos.error;
      }
    }

    if (erro.code === "ECONNABORTED") {
      return "A análise demorou mais que o esperado. Seus dados foram mantidos, tente novamente.";
    }

    if (!erro.response) {
      return "Não foi possível conectar ao servidor. Verifique sua internet e a API.";
    }
  }
  
if (
  erro instanceof Error &&
  erro.message.startsWith("O Gemini")
) {
  return erro.message;
}

if (
  erro instanceof Error &&
  erro.message.startsWith("Autorize")
) {
  return erro.message;
}


  return "Não foi possível concluir a operação. Tente novamente.";
}

// ---------------------------------------------------------------------
// Texto da IA
// ---------------------------------------------------------------------

// O Gemini responde em markdown. Tira as marcações para mostrar texto limpo
export function limparTextoIA(texto: string): string {
  const limpo = texto
    .replace(/\r/g, "")
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^\s*[*-]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return limpo || "A IA não retornou uma análise em texto desta vez.";
}


function converterEstrategiasGemini(
  estrategias: EstrategiaGeminiApi[],
): Estrategia[] {
  return estrategias.map((item, indice) => ({
    id: `gemini-${indice}`,
    titulo: item.titulo,
    descricao: item.descricao,
    impactos: [
      {
        rotulo: "Por que essa opção",
        valor: item.justificativa,
      },
      ...item.vantagens.map((vantagem) => ({
        rotulo: "Vantagem",
        valor: vantagem,
        tom: "positivo" as const,
      })),
      ...item.riscos.map((risco) => ({
        rotulo: "Risco",
        valor: risco,
        tom: "alerta" as const,
      })),
    ],
  }));
}


// ---------------------------------------------------------------------
// Chamadas à API
// ---------------------------------------------------------------------

export async function listarImprevistos(): Promise<Imprevisto[]> {
  const { data } = await api.get<ImprevistoApi[]>("/imprevistos");
  const local = await lerLocal();

  return data.map((linha) => paraImprevisto(linha, local));
}

export async function buscarImprevisto(id: string): Promise<Imprevisto> {
  const { data } = await api.get<ImprevistoApi>(`/imprevistos/${id}`);

  return paraImprevisto(data, await lerLocal());
}

// Chama a IA. O backend grava o imprevisto junto (veja o aviso no topo).
// "guardarTipo" é falso nas linhas temporárias (nova análise de um
// imprevisto que já existe), que são apagadas logo em seguida.

async function chamarAnalise(
  dados: DadosImprevisto,
  guardarTipo = true,
  autorizarEnvioIA = false,
): Promise<ResultadoAnalise> {
  if (!autorizarEnvioIA) {
    throw new Error(
      "Autorize o envio dos dados financeiros ao Gemini para solicitar a análise."
    );
  }

  const { data } = await api.post<RespostaPlanoB>(
    "/plano-b",
    {
      imprevisto: corpo(dados),
      autorizarEnvioIA,
    },
    { timeout: TEMPO_ANALISE_MS },
  );

  if (
    !data.analiseEstruturada ||
    !Array.isArray(data.estrategias)
  ) {
    throw new Error(
      "O Gemini não retornou estratégias em formato válido."
    );
  }

  if (
    guardarTipo &&
    data.imprevisto.tipo === "OUTRO"
  ) {
    await definirTipo(
      String(data.imprevisto.id_Imprevisto),
      dados.tipoDetalhe
    );
  }

  const imprevisto = paraImprevisto(
    data.imprevisto,
    await lerLocal()
  );

  const prioridades = Array.isArray(data.prioridades)
    ? data.prioridades.filter(
        (p) => typeof p === "string" && p.trim()
      )
    : [];

  const analise: Analise = {
    texto: [
      limparTextoIA(data.resposta ?? ""),
      prioridades.length
        ? `Prioridades:\n${prioridades
            .map((p, i) => `${i + 1}. ${p}`)
            .join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n"),

    situacao: data.situacaoFinanceira,

    estrategias: converterEstrategiasGemini(
      data.estrategias
    ),
  };

  analises.set(imprevisto.id, analise);

  return { imprevisto, analise };
}


async function apagarSilencioso(id: string): Promise<void> {
  try {
    await api.delete(`/imprevistos/${id}`);
  } catch {
    // Linha temporária que não pôde ser apagada: não atrapalha o usuário
  }

  analises.delete(id);
  await definirTipo(id);
}

// Primeira análise (ou nova análise de um formulário ainda não confirmado).
// Se já existia uma análise anterior ainda sem estratégia, a linha antiga é
// apagada para não ficar imprevisto duplicado no histórico.

export async function analisarImprevisto(
  dados: DadosImprevisto,
  idAnterior?: string,
  autorizarEnvioIA = false,
): Promise<ResultadoAnalise> {
  const resultado = await chamarAnalise(
    dados,
    true,
    autorizarEnvioIA
  );

  if (
    idAnterior &&
    idAnterior !== resultado.imprevisto.id
  ) {
    await apagarSilencioso(idAnterior);
  }

  return resultado;
}


// Nova análise de um imprevisto que já está no histórico: a IA grava uma
// linha nova, que é apagada em seguida; a análise passa a valer para o id
// original.

export async function reanalisarImprevisto(
  id: string,
  dados: DadosImprevisto,
  autorizarEnvioIA = false,
): Promise<Analise> {
  const { imprevisto, analise } =
    await chamarAnalise(
      dados,
      false,
      autorizarEnvioIA
    );

  await apagarSilencioso(imprevisto.id);
  analises.set(id, analise);

  return analise;
}


// Grava a estratégia escolhida (não movimenta dinheiro da reserva)
export async function escolherEstrategia(
  id: string,
  titulo: string,
): Promise<Imprevisto> {
  const { data } = await api.put<ImprevistoApi>(`/imprevistos/${id}`, {
    solucao_escolhida: titulo.slice(0, 100),
  });

  return paraImprevisto(data, await lerLocal());
}

export async function atualizarImprevisto(
  id: string,
  dados: DadosImprevisto,
): Promise<Imprevisto> {
  const { data } = await api.put<ImprevistoApi>(
    `/imprevistos/${id}`,
    corpo(dados),
  );

  await definirTipo(
    id,
    data.tipo === "OUTRO" ? dados.tipoDetalhe : undefined,
  );

  return paraImprevisto(data, await lerLocal());
}

export async function excluirImprevisto(id: string): Promise<void> {
  await api.delete(`/imprevistos/${id}`);

  analises.delete(id);
  await definirTipo(id);

  const conjunto = await lerResolvidos();

  if (conjunto.delete(id)) {
    await salvarResolvidos(conjunto);
  }
}

// "Resolvido" só existe no aparelho (o banco ainda não tem esse campo)
export async function definirResolvido(
  imprevisto: Imprevisto,
  resolvido: boolean,
): Promise<Imprevisto> {
  const conjunto = await lerResolvidos();

  if (resolvido) {
    conjunto.add(imprevisto.id);
  } else {
    conjunto.delete(imprevisto.id);
  }

  await salvarResolvidos(conjunto);

  return {
    ...imprevisto,
    status: resolvido
      ? "resolvido"
      : imprevisto.estrategia
        ? "andamento"
        : "pendente",
  };
}