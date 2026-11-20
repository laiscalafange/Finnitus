
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

  lista: {
    paddingHorizontal: 16,
    paddingTop: 2,
  },

  tituloSecao: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: Cores.destaque.limao,
    marginBottom: 14,
    marginTop: 12,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 12,
    overflow: "hidden",
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconeCirculo: {
    width: 38,
  },

  perguntaTexto: {
    flex: 1,
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },

  respostaContainer: {
    marginTop: 14,
  },

  divisor: {
    height: 1,
    backgroundColor: "rgba(163, 87, 255, 0.22)",
    marginBottom: 12,
  },

  respostaTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 21,
    color: Cores.texto.claro,
  },

  suporte: {
    marginTop: 16,
    marginBottom: 10,
  },

  suporteTitulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },

  suporteDescricao: {
    fontFamily: FONTS.raleway.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Cores.texto.claro,
    marginBottom: 16,
  },
});
