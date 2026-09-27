import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { paddingBottom: 30 },

  lista: {
    paddingHorizontal: 16,
    paddingTop: 40,
    marginTop: -300,
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
});