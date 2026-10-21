import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { paddingBottom: 30 },

  lista: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  card: {
    marginBottom: 16,
    borderColor: "rgba(168, 79, 255, 0.35)",
  },

  linhaIcone: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  rotuloItem: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  espacoTopo: {
    marginTop: 16,
  },

  divisor: {
    height: 1,
    backgroundColor: Cores.interface.divisor,
    marginVertical: 16,
  },

  linhaSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rotuloSwitch: {
    flex: 1,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.base.branco,
    marginRight: 12,
  },

  linhaResetar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  textoResetar: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.estado.erro,
  },
});