import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 10,
  },

  lista: {
    paddingHorizontal: 16,
    paddingTop: 2,
    gap: 2,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    paddingHorizontal: 15,
    paddingVertical: 14,
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconeCirculo: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "rgba(183, 255, 0, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  rotulo: {
    flex: 1,
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },
});
