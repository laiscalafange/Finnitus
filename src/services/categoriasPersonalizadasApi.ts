// Ajuste este import caso sua instancia Axios esteja em outro caminho.
import { api } from "./api";

export type TipoCategoriaApi = "RECEITA" | "DESPESA";

export type CategoriaPersonalizadaApi = {
  id_CategoriaPersonalizada: number;
  id_Usuario: number;
  nome: string;
  tipo: TipoCategoriaApi;
};

// Confirme em src/backend/src/Servidor/app.ts qual prefixo foi usado
// para montar categoriaPersonalizada.routes.ts.
const ROTA = "/categorias-personalizadas";

export async function listarCategoriasPersonalizadasApi(): Promise<CategoriaPersonalizadaApi[]> {
  const { data } = await api.get<CategoriaPersonalizadaApi[]>(ROTA);
  return data;
}

export async function criarCategoriaPersonalizadaApi(
  nome: string,
  tipo: TipoCategoriaApi,
): Promise<CategoriaPersonalizadaApi> {
  const { data } = await api.post<CategoriaPersonalizadaApi>(ROTA, {
    nome,
    tipo,
  });
  return data;
}
