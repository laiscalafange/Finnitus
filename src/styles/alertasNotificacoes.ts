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

  linhaSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  linhaIcone: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 12,
  },

  rotuloSwitch: {
    flex: 1,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.base.branco,
  },
});