
import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  // Área completa do seletor
  wrapper: {
    marginBottom: 6,
  },

  // Título acima dos cartões
  rotulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: "#D8C6F0",
    marginBottom: 10,
  },

  // Grade com três categorias por linha
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },

  // Cartões compactos
  item: {
    width: "31.5%",
    minHeight: 76,

    alignItems: "center",
    justifyContent: "center",

    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 4,

    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.25)",
    borderRadius: 12,

    backgroundColor: "rgba(28, 19, 43, 0.85)",
  },

  // Categoria selecionada
  itemAtivo: {
    borderColor: Cores.destaque.limao,
    backgroundColor: "rgba(103, 69, 146, 0.28)",
  },

  // Nome das categorias
  nome: {
    maxWidth: "100%",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 11,
    color: "#C7A9F5",
    textAlign: "center",
  },

  // Nome da categoria selecionada
  nomeAtivo: {
    fontFamily: FONTS.quicksand.bold,
    color: "#E8FFB0",
  },
});
