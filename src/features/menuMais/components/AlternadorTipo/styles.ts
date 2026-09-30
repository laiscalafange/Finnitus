import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  // Trilha com as duas opções
  container: {
    flexDirection: "row",
    backgroundColor: Cores.overlay.cardForte,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    borderRadius: 30,
    padding: 4,
    marginBottom: 20,
  },

  opcao: {
    flex: 1,
    height: 44,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  texto: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.texto.claro,
  },

  // Texto da opção marcada (roxo escuro sobre a cor de destaque)
  textoAtivo: {
    color: Cores.texto.contraste,
  },
});