
import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 40,
  },

  lista: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 82,
    paddingVertical: 13,
  },

  itemComDivisor: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(163, 87, 255, 0.15)",
  },

  iconeContainer: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "rgba(183, 255, 0, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(183, 255, 0, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  textosItem: {
    flex: 1,
    paddingRight: 8,
  },

  tituloItem: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.base.branco,
    marginBottom: 4,
  },

  descricaoItem: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    lineHeight: 17,
    color: "#C6B2DD",
  },
});
