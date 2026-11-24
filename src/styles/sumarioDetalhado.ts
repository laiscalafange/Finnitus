import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 30,
  },

  conteudoSobreHeader: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },

  // GASTOS E ECONOMIAS

  linhaTotais: {
    flexDirection: "row",
    gap: 12,
  },

  cardTotal: {
    flex: 1,
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.25)",
    paddingVertical: 18,
  },

  totalRotulo: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 14,
    color:  Cores.destaque.limao,
  },

  totalValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 25,
    
  },

  // CARDS

  cardPadrao: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.25)",
  },

  tituloCard: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },

  // GRÁFICO

  graficoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  // CATEGORIAS

  linhaCategoria: {
    marginTop: 16,
    marginBottom: 4,
  },

  topoCategoria: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },

  categoriaIdentificacao: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  categoriaPonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  categoriaNome: {
    flexShrink: 1,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 15,
    color: Cores.destaque.limao,
  },

  categoriaValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color:  Cores.destaque.limao,
  },

  categoriaPercentual: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: "#C7A9F5",
    minWidth: 46,
    textAlign: "right",
  },

  // BARRAS DE PROGRESSO

  progressoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  barraFundo: {
    flex: 1,
    height: 8,
    borderRadius: 8,
    backgroundColor: "rgba(13, 17, 18, 0.45)",
    overflow: "hidden",
  },

  barraPreenchida: {
    height: "100%",
    borderRadius: 8,
  },

  // ESTADO VAZIO

  vazio: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 14,
    color: "#C7A9F5",
    textAlign: "center",
    marginVertical: 14,
  },
});