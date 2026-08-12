import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { FONTS } from "../../constants/Tipografia";

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
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(18),
  },

  // Variantes
  primario: {},

  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#7e3bed",
  },

  secundario: {
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    width: "75%",
    height: 50,
    marginBottom: 20,
  },

  terciario: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: "#B7FF00",
    borderRadius: 5,
    padding: 2,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },

  // Cores do texto
  texto_primario: {
    color: "#B7FF00",
  },

  texto_outline: {
    color: "#7E3BED",
  },

  texto_secundario: {
    color: "#A357FF",
  },

  texto_terciario: {
    color: "#B7FF00",
  },
});