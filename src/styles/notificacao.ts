import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 30,
  },

  conteudoLista: {
    paddingHorizontal: 16,
    paddingTop: 18,
    marginTop: -300,
  },

  linhaMarcarTodas: {
    alignItems: "flex-end",
    marginBottom: 10,
  },

  marcarTodas: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.destaque.limao,
  },
});