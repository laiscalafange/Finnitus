import { api } from "./api";

export type TipoMetaApi =
  | "MENSAL"
  | "LONGO_PRAZO";

export type StatusMetaApi =
  | "EM_ANDAMENTO"
  | "CONCLUIDA"
  | "CANCELADA";

export type MovimentacaoMetaApi = {
  id_Movimentacao: number;
  id_Meta: number;
  valor: number | string;
  tipo: "APORTE" | "RETIRADA";
  data: string;
  descricao?: string | null;
};

export type MetaApi = {
  id_Meta: number;
  id_Usuario: number;

  Mnome: string;

  Mvalor_objetivo: number | string;
  Mvalor_atual: number | string;
  Mvalor_periodo?: number | string | null;

  Mtipo: TipoMetaApi;

  Mmes_referencia?: string | null;
  Mprazo?: string | null;

  Mprioridade: "BAIXA" | "MEDIA" | "ALTA";
  Mstatus: StatusMetaApi;

  Mdata_criacao: string;
  Mdata_conclusao?: string | null;
  Mdata_cancelamento?: string | null;

  MovimentacaoMeta?: MovimentacaoMetaApi[];
};

export type CriarMetaApiDados = {
  nome: string;
  tipo: TipoMetaApi;
  valorObjetivo: number;
  valorInicial?: number;
  valorPeriodo?: number;
  dataLimite?: string;
  mesReferencia?: string;
};

export async function criarMetaApi(
  dados: CriarMetaApiDados,
): Promise<MetaApi> {
  const response = await api.post(
    "/metas",
    dados,
  );

  return response.data;
}

export async function listarMetasApi(
  mes: string,
): Promise<{
  mensais: MetaApi[];
  longoPrazo: MetaApi[];
}> {
  const response = await api.get(
    "/metas",
    {
      params: {
        mes,
      },
    },
  );

  return response.data;
}

export async function buscarMetaApi(
  id: number,
): Promise<MetaApi> {
  const response = await api.get(
    `/metas/${id}`,
  );

  return response.data;
}

export async function adicionarAporteApi(
  id: number,
  valor: number,
) {
  const response = await api.post(
    `/metas/${id}/aportes`,
    {
      valor,
    },
  );

  return response.data;
}

export async function retirarMetaApi(
  id: number,
  valor: number,
) {
  const response = await api.post(
    `/metas/${id}/retiradas`,
    {
      valor,
    },
  );

  return response.data;
}

export async function cancelarMetaApi(
  id: number,
) {
  const response = await api.patch(
    `/metas/${id}/cancelar`,
  );

  return response.data;
}

export async function listarHistoricoApi(): Promise<
  MetaApi[]
> {
  const response = await api.get(
    "/metas/historico",
  );

  return response.data;
}

export async function obterAnalisesApi() {
  const response = await api.get(
    "/metas/analises",
  );

  return response.data;
}