import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Base do botão
  botaoBase: {
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width: 399,
    height: 49,
  },

  // Texto padrão
  textoBase: {
    fontWeight: "700",
    fontSize: 15,
  },

  // Variantes
  primario: {},

  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#7E3BED",
  },

  // Cores do texto
  texto_primario: {
    color: "#B7FF00",
  },

  texto_outline: {
    color: "#7E3BED",
  },
});