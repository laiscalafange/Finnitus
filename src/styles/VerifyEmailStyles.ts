import { StyleSheet } from "react-native";
import { Cores } from "../shared/constants/Cores";
import { FONTS } from "../shared/constants/Tipografia";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },

  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: RFValue(35),
    color: Cores.base.branco,
    marginBottom: 24,
  },

  tituloDestaque: {
    fontFamily: FONTS.raleway.extrabold,
    color: Cores.destaque.limao,
  },

  subtitulo: {
    fontFamily: FONTS.raleway.regular,
    fontSize: RFValue(20),
    color: Cores.base.branco,
    lineHeight: 24,
    marginBottom: 40,
  },

  emailDestaque: {
    fontFamily: FONTS.raleway.medium,
    color: Cores.roxo.claro,
  },

  label: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: Cores.destaque.limao,
    marginBottom: 16,
  },

  rodape: {
  position: "absolute",
  bottom: 50,
  width: "100%",
  alignSelf: "center",

  },

  reenviar: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 16,
    color: "#9B5CF6",
    alignSelf: "center",
    marginTop: -10,
  },
});