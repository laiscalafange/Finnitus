import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { paddingBottom: 30 },

  // Área do conteúdo, logo abaixo do cabeçalho discreto (HeaderInterno)
  lista: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // Cada item é um Card, com o mesmo fundo/borda roxos usados no Ajuda
  card: {
    marginBottom: 14,
    borderColor: "rgba(168, 79, 255, 0.35)",
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconeCirculo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(183, 255, 0, 0.12)",
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