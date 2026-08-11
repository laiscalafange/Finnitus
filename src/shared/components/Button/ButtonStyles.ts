import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  // Base do botão
  botaoBase: {
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    marginBottom: 20,
  },

  // Texto padrão
  textoBase: {
    fontWeight: "700",
    fontSize: RFValue(18),
  },

  // Variantes
  primario: {},

  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#7e3bed",
  },

  // Cores do texto
  texto_primario: {
    color: "#B7FF00",
  },

  texto_outline: {
    color: "#7E3BED",
  },
});