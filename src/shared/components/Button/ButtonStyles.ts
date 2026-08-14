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

  botaotexto: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

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

  texto_botaotexto: {
    fontFamily: FONTS.raleway.regular,
    fontSize: RFValue(12),
    color: "#A357FF",
  },

  icone: {
    marginRight: 10,
  },
});