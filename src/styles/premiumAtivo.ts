import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  // Ocupa a tela toda (gradiente de fundo)
  fundo: {
    flex: 1,
  },

  // Tudo centralizado na tela, igual ao protótipo
  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  // Círculo verde-limão com o check
  circulo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 30,
    lineHeight: 38,
    color: Cores.base.branco,
    textAlign: "center",
    marginBottom: 14,
  },

  texto: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 14,
    lineHeight: 21,
    color: Cores.texto.claro,
    textAlign: "center",
    marginBottom: 32,
  },

  // Trecho em destaque dentro do texto (a data da cobrança)
  textoDestaque: {
    fontFamily: FONTS.quicksand.bold,
    color: Cores.base.branco,
  },

  // Área do botão (o Button ocupa 100% da largura)
  botao: {
    width: "100%",
  },
});