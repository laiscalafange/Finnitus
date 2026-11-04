
import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 35,
  },

  conteudoSobreHeader: {
    paddingTop: 8,
    paddingHorizontal: 16,
    gap: 12,
  },

  areaFiltros: {
    marginBottom: 2,
  },

  // CARD PRINCIPAL
  card: {
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 12,
    marginBottom: 0,
    borderRadius: 20,
    borderColor: "rgba(163, 87, 255, 0.25)",
  },

  // CABEÇALHO DO CARD
  linhaCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  caixaIcone: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(163, 87, 255, 0.12)",
  },

  textos: {
    flex: 1,
    gap: 3,
  },

  nome: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },

  data: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 11,
    color: "#C7A9F5",
  },

  // STATUS
  selo: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  seloConcluida: {
    backgroundColor: "rgba(183, 255, 0, 0.12)",
  },

  seloCancelada: {
    backgroundColor: "rgba(163, 87, 255, 0.14)",
  },

  seloTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 10,
  },

  seloTextoConcluida: {
    color: Cores.destaque.limao,
  },

  seloTextoCancelada: {
    color: "#C7A9F5",
  },

  // VALORES
  linhaValores: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 13,
    gap: 10,
  },

  blocoValor: {
    flex: 1,
  },

  blocoValorDireita: {
    flex: 1,
    alignItems: "flex-end",
  },

  rotuloValor: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 11,
    color: "#C7A9F5",
    marginBottom: 3,
  },

  valorGuardado: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: "#FFFFFF",
  },

  valorObjetivo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "right",
  },

  // PROGRESSO
  areaProgresso: {
    marginTop: 13,
  },

  linhaProgresso: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
  },

  rotuloProgresso: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 11,
    color: "#C7A9F5",
  },

  percentual: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: "#C7A9F5",
  },

  percentualConcluida: {
    color: Cores.destaque.limao,
  },

  // BOTÃO DESFAZER
  botaoDesfazer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 13,
    minHeight: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    backgroundColor: "rgba(163, 87, 255, 0.08)",
  },

  textoDesfazer: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: "#C7A9F5",
  },

  botaoPressionado: {
    opacity: 0.7,
  },

  botaoDesabilitado: {
    opacity: 0.45,
  },

  // ESTADO VAZIO
  vazio: {
    marginTop: 24,
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: "#C7A9F5",
  },
});
