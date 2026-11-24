import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  aviso: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    lineHeight: 17,
    color: Cores.texto.claro,
    marginBottom: 16,
  },
});
