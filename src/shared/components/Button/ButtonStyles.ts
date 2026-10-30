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

  // Ações destrutivas (ex.: excluir conta)
  perigo: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#EF4444",
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

  texto_perigo: {
    color: "#EF4444",
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

  // ---- Tamanho "compacto" (prop tamanho do <Button>) ----
  // Vem depois do estilo da variante, então ganha dele (largura, altura, margem)
  compacto: {
    width: "100%",
    alignSelf: "stretch",
    height: 44,
    padding: 0,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 0,
  },

  // "outline" e "secundario" compactos: fundo roxo transparente com borda roxa
  compactoTranslucido: {
    backgroundColor: "rgba(126, 59, 237, 0.20)",
    borderWidth: 1.5,
    borderColor: "#7E3BED",
  },

  textoCompacto: {
    fontSize: 15,
  },

  textoCompactoTranslucido: {
    fontFamily: FONTS.raleway.bold,
    color: "#D8CDF7",
  },
});