import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { paddingBottom: 30 },

  formulario: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  texto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
    marginBottom: 20,
  },

  espacoBotoes: { marginTop: 24 },

  aviso: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    lineHeight: 17,
    color: Cores.texto.claro,
    marginBottom: 16,
  },

  erro: {
    color: "#ffb4b4",
    fontSize: 14,
    fontFamily: FONTS.quicksand.semibold,
    marginBottom: 12,
  },
});