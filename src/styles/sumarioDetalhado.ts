import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Espaço no final pra o último card não colar no fim da tela
  conteudo: {
    paddingBottom: 30,
  },

  // Conteúdo logo abaixo do cabeçalho discreto (HeaderInterno)
  conteudoSobreHeader: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },

  // Gastos e Economias lado a lado
  linhaTotais: {
    flexDirection: "row",
    gap: 12,
  },

  cardTotal: {
    flex: 1,
    gap: 6,
  },

  totalRotulo: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  totalValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
  },

  tituloCard: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },

  // Linha de cada categoria: nome à esquerda e valor à direita
  linhaCategoria: {
    marginTop: 12,
  },

  topoCategoria: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  categoriaNome: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 15,
    color: Cores.base.branco,
  },

  categoriaValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  // Trilha da barra (a parte preenchida usa a cor da categoria)
  barraFundo: {
    height: 6,
    borderRadius: 4,
    backgroundColor: Cores.overlay.medio,
    overflow: "hidden",
  },

  barraPreenchida: {
    height: "100%",
    borderRadius: 4,
  },

  // Mensagem quando ainda não há gastos pra mostrar
  vazio: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 14,
    color: Cores.texto.claro,
    textAlign: "center",
    marginVertical: 14,
  },
});