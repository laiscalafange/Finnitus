
import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  fundo: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  card: {
    borderColor: "rgba(168, 79, 255, 0.35)",
    marginBottom: 0,
    paddingTop: 22,
  },

  fechar: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 2,
  },

  titulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 22,
    color: Cores.destaque.limao,
    paddingRight: 28,
    marginBottom: 12,
  },

  pergunta: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 15,
    color: Cores.texto.claro,
    marginBottom: 10,
  },

  prefixoMoeda: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
  },

  dica: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.claro,
    marginTop: -6,
    marginBottom: 18,
  },

  centralizado: {
    alignItems: "center",
  },

  iconeTopo: {
    marginBottom: 14,
  },

  imagemIcone: {
    width: 64,
    height: 64,
  },

  tituloCentro: {
    textAlign: "center",
    paddingRight: 0,
  },

  texto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
    textAlign: "center",
    marginBottom: 20,
  },

  botoes: {
    alignSelf: "stretch",
  },

  botoesCompactos: {
    gap: 10,
  },

  linhaBotoes: {
    flexDirection: "row",
    gap: 10,
  },

  colunaBotao: {
    flex: 1,
  },

  // CAMPOS DE VALOR DA RESERVA

  campoValorReserva: {
    backgroundColor: "#20152F",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.45)",
    borderRadius: 13,
    minHeight: 50,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  textoValorReserva: {
    flex: 1,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 16,
    color: Cores.base.branco,
    paddingVertical: 12,
  },

  prefixoValorReserva: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginRight: 10,
  },

  linhaCampoValor: {
    flexDirection: "row",
    alignItems: "center",
  },

  botaoConfirmarReserva: {
    minHeight: 46,
    backgroundColor: "#38205B",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.45)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  textoConfirmarReserva: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.destaque.limao,
  },

  botaoCancelarReserva: {
    minHeight: 46,
    backgroundColor: "rgba(163, 87, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.3)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  textoCancelarReserva: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: "#C7A9F5",
  },

  botaoPressionado: {
    opacity: 0.75,
  },

  // POP-UPS DE CANCELAR META E EXCLUIR RESERVA

  cardConfirmacao: {
    width: "94%",
    alignSelf: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.25)",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 0,
  },

  conteudoConfirmacao: {
    alignItems: "center",
  },

  iconeConfirmacao: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "rgba(163, 87, 255, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  tituloConfirmacao: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 21,
    color: Cores.destaque.limao,
    textAlign: "center",
    marginBottom: 9,
    paddingHorizontal: 24,
  },

  descricaoConfirmacao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    lineHeight: 19,
    color: "#C7A9F5",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 3,
  },

  botoesConfirmacao: {
    flexDirection: "row",
    alignSelf: "stretch",
    gap: 10,
  },

  botaoVoltarConfirmacao: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.3)",
    backgroundColor: "rgba(163, 87, 255, 0.06)",
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  textoVoltarConfirmacao: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: "#C7A9F5",
    textAlign: "center",
  },

  botaoPerigoConfirmacao: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 115, 115, 0.35)",
    backgroundColor: "rgba(255, 90, 90, 0.13)",
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  textoPerigoConfirmacao: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 13,
    color: "#FF9393",
    textAlign: "center",
  },

  botaoDesabilitado: {
    opacity: 0.45,
  },
});
