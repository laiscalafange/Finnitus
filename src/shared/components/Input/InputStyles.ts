
import { StyleSheet } from "react-native";

import { Cores } from "../../constants/Cores";
import { FONTS } from "../../constants/Tipografia";

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },

  label: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: "#D8C6F0",
    marginBottom: 6,
  },

  campo: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "rgba(28, 19, 43, 0.85)",

    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.28)",
    borderRadius: 12,

    paddingHorizontal: 14,
    height: 52,
  },

  campoErro: {
    borderColor: Cores.estado.erro,
  },

  campoMultilinha: {
    height: 112,
    alignItems: "flex-start",
    paddingVertical: 12,
  },

  inputMultilinha: {
    height: "100%",
    textAlignVertical: "top",
  },

  icone: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: "#F5F0FF",
    paddingVertical: 0,
  },

  erro: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.estado.erro,
    marginTop: 5,
  },
});
