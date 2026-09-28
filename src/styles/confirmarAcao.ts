import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { paddingBottom: 30 },

  // Área do conteúdo. O marginTop negativo faz ela "subir" por cima
  // da faixa roxa do HeaderInterno (mesmo padrão das outras telas de conta)
  lista: {
    paddingHorizontal: 16,
    paddingTop: 40,
    marginTop: -300,
  },

  card: {
    marginBottom: 20,
    alignItems: "center",
    borderColor: "rgba(168, 79, 255, 0.35)",
  },

  // Card de "Excluir conta": borda vermelha de alerta
  cardExcluir: {
    borderColor: "rgba(239, 68, 68, 0.4)",
  },

  iconeCirculo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  pergunta: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: Cores.base.branco,
    textAlign: "center",
    marginBottom: 8,
  },

  descricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
    textAlign: "center",
  },

  erro: {
    color: "#ffb4b4",
    fontSize: 14,
    fontFamily: FONTS.quicksand.semibold,
    marginBottom: 12,
  },
});