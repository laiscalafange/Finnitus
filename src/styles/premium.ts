import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  fundo: {
    flex: 1,
  },

  // Seletor de plano
  abas: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: -259,
    marginBottom: 12,
    padding: 4,
  },

  aba: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },

  abaAtiva: {
    backgroundColor: Cores.destaque.limao,
  },

  abaTexto: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.principal,
  },

  abaTextoAtivo: {
    color: Cores.roxo.escuro,
  },

  // Carrossel
  carrossel: {
    flex: 1,
    marginTop: 1,
  },

  paginaCard: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Card
  card: {
    backgroundColor: "#462e8a73",
    borderColor: Cores.destaque.limao,
    borderWidth: 1,
    borderRadius: 9,
    padding: 22,
  },

  badge: {
    alignSelf: "center",
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.destaque.limao,
    marginBottom: 10,
  },

  nome: {
    textAlign: "center",
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 26,
    color: Cores.base.branco,
  },

  descricao: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.texto.principal,
    marginTop: 8,
  },

  preco: {
    textAlign: "center",
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: Cores.base.branco,
    marginTop: 16,
  },

  periodo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.principal,
  },

  teste: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.medium,
    fontSize: 12,
    color: Cores.texto.principal,
    marginTop: 4,
  },

  divisor: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 14,
  },

  linha: {
    flex: 1,
    height: 1,
    backgroundColor: Cores.destaque.limao,
    opacity: 0.5,
  },

  divisorTexto: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.destaque.limao,
    marginHorizontal: 10,
  },

  beneficio: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  bolinha: {
    color: Cores.destaque.limao,
    fontSize: 14,
    marginRight: 8,
  },

  beneficioTexto: {
    flex: 1,
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.base.branco,
  },
});