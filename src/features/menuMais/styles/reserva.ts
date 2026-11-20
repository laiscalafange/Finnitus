
import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  card: {
    borderColor: "rgba(163, 87, 255, 0.47)",
  },

  // SALDO DISPONÍVEL
  cardSaldo: {
    borderColor: "rgba(163, 87, 255, 0.51)",
    paddingVertical: 22,
    paddingHorizontal: 18,
  },

  linhaSaldo: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  rotuloPequeno: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 17,
    color: "#C7A9F5",
  },

  valorSaldo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 38,
    lineHeight: 44,
    color: Cores.destaque.limao,
    textAlign: "center",
  },

  // META DA RESERVA
  linhaMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  chipMeta: {
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.45)",
    backgroundColor: "rgba(163, 87, 255, 0.08)",
    borderRadius: 9,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },

  textoChipMeta: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: "#C7A9F5",
  },

  valorMeta: {
    fontFamily: FONTS.raleway.semibold,
    fontSize: 20,
    color: Cores.base.branco,
    marginBottom: 12,
  },

  linhaProgresso: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    
  },

  barraProgresso: {
    flex: 1,
   
  },

  percentual: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: "#C7A9F5",
  },

  // DEPOSITAR E RETIRAR
  linhaBotoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
    marginBottom: 8,
  },

  botaoDepositar: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: "rgba(89, 48, 145, 0.78)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  botaoRetirar: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: "rgba(56, 32, 91, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  textoBotaoDepositar: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.destaque.limao,
  },

  textoBotaoRetirar: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: "#C7A9F5",
  },

  botaoPressionado: {
    opacity: 0.75,
  },

  // ÚLTIMAS MOVIMENTAÇÕES
  tituloSecao: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    lineHeight: 27,
    color: Cores.destaque.limao,
    marginTop: 12,
    marginBottom: 10,
  },

  semMovimentacoes: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.texto.claro,
    marginBottom: 12,
  },

  linhaMovimentacao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  circuloMovimentacao: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  circuloDeposito: {
    backgroundColor: "rgba(107, 195, 0, 0.20)",
  },

  circuloRetirada: {
    backgroundColor: "rgba(163, 87, 255, 0.18)",
  },

  textosMovimentacao: {
    flex: 1,
  },

  valorMovimentacao: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  valorRetirada: {
    color: "#C7A9F5",
  },

  tipoMovimentacao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  dataMovimentacao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  // EXCLUIR RESERVA
  botaoExcluir: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    minHeight: 46,
    paddingHorizontal: 14,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 95, 95, 0.55)",
    backgroundColor: "rgba(255, 65, 65, 0.08)",
  },

  textoExcluir: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: "#FF7777",
  },
});
