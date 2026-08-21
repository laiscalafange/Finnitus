import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  // Fundo escuro semi-transparente por trás do card (efeito de modal)
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },

  // Card central com a mensagem de meta alcançada
  frame: {
    width: "90%",
    minHeight: 345,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  icone: {
    width: 75,
    height: 75,
    marginBottom: 15,
  },

  titulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 24,
    color: Cores.destaque.limao,
    textAlign: "center",
    marginBottom: 5,
  },

  mensagem: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 15,
    color: "#B98AFF",
    textAlign: "center",
    lineHeight: 15,
    marginBottom: 20,
  },
});