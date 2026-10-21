import { StyleSheet } from "react-native";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  // Ocupa a tela toda (gradiente de fundo + área do teclado)
  container: {
    flex: 1,
  },

  // Conteúdo do ScrollView, só um espaço no final pra não colar no fim da tela
  conteudo: {
    paddingBottom: 30,
  },

  // Área do conteúdo, logo abaixo do cabeçalho discreto (HeaderInterno)
  formulario: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // Mensagem de erro acima do botão
  erro: {
    color: "#ffb4b4",
    fontSize: 14,
    fontFamily: FONTS.quicksand.semibold,
    marginBottom: 12,
  },
});