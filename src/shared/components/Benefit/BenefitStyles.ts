import { StyleSheet } from "react-native";
import { Cores } from "../../constants/Cores";
import { FONTS } from "../../constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },

  icon: {
    fontSize: 30,
    color: Cores.destaque.limao,
    marginTop: 2,
  },

  texts: {
    flex: 1,
  },

  title: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: Cores.destaque.limao,
    marginBottom: 6,
  },

  description: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 18,
    color: Cores.texto.principal,
    lineHeight: 26,
  },
});