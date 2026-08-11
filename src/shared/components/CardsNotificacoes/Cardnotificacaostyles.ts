import { StyleSheet } from "react-native";
import { Cores } from "../../constants/Cores";
import { FONTS } from "../../constants/Tipografia";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 18,
    borderColor: "rgba(168, 79, 255, 0.28)",
    borderWidth: 2,
    marginBottom: 12,
  },

  icone: {
    width: 42,
    height: 42,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  textoContainer: {
    flex: 1,
  },

  mensagem: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    lineHeight: 19,
    color: Cores.base.branco,
  },

  tempo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 11,
    color: Cores.texto.secundario,
    marginTop: 6,
  },
});