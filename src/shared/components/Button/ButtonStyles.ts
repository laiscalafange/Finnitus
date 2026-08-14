import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { FONTS } from "../../constants/Tipografia";

export const styles = StyleSheet.create({
  botaoBase: {
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    marginBottom: 20,
  },

  conteudoBotao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  textoBase: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(18),
  },

  primario: {},

  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#7e3bed",
  },

  texto_primario: {
    color: "#B7FF00",
  },

  texto_outline: {
    color: "#7E3BED",
  },

  icone: {
    marginRight: 10,
  },
});