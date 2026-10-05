import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

// O overlay, o fundo escurecido, o card, o X e o título são os mesmos do
// ModalReserva (ver ModalReserva/styles). Aqui só ficam o seletor de ano e a
// grade de meses.
export const styles = StyleSheet.create({
  // ‹ 2026 ›
  linhaAno: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  setaAno: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  setaAnoTexto: {
    color: Cores.destaque.limao,
    fontSize: 28,
    lineHeight: 32,
  },

  setaAnoDesativada: {
    opacity: 0.3,
  },

  ano: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: Cores.texto.claro,
  },

  // Grade com 3 meses por linha
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 18,
  },

  mes: {
    width: "31%",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#53269D",
  },

  mesSelecionado: {
    backgroundColor: Cores.destaque.limao,
  },

  mesTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.texto.claro,
  },

  mesTextoSelecionado: {
    color: Cores.texto.contraste,
  },
});