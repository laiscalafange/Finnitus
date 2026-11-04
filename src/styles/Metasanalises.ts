
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

  // TOTAL GUARDADO
  cardTotal: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 23,
    marginBottom: 0,
    borderRadius: 22,
    borderColor: "rgba(163, 87, 255, 0.25)",
  },

  iconeTotal: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(163, 87, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  rotuloTotal: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 15,
    color: "#C7A9F5",
    textAlign: "center",
  },

  valorTotal: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 34,
    color: Cores.destaque.limao,
    textAlign: "center",
    marginTop: 7,
  },

  descricaoTotal: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: "#C7A9F5",
    textAlign: "center",
    marginTop: 7,
  },

  // RESUMO COMPACTO
  linhaResumo: {
    flexDirection: "row",
    gap: 10,
  },

  cardResumo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 0,
    borderRadius: 18,
    borderColor: "rgba(163, 87, 255, 0.25)",
  },

  valorResumo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 24,
  },

  rotuloResumo: {
    marginTop: 3,
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 12,
    color: "#C7A9F5",
  },

  // CARDS PRINCIPAIS
  cardSecao: {
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 18,
    marginBottom: 0,
    borderRadius: 22,
    borderColor: "rgba(163, 87, 255, 0.25)",
  },

  tituloCard: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 21,
    color: "#C7A9F5",
    marginBottom: 15,
  },

  subtituloCard: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: "#C7A9F5",
    marginTop: -9,
    marginBottom: 10,
  },

  // PROGRESSO DAS METAS
  itemMeta: {
    marginBottom: 17,
  },

  ultimoItemMeta: {
    marginBottom: 0,
  },

  linhaMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
    gap: 10,
  },

  nomeMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flex: 1,
  },

  textoNome: {
    flexShrink: 1,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: "#FFFFFF",
  },

  percentual: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: "#C7A9F5",
  },

  percentualDestaque: {
    color: Cores.destaque.limao,
  },

  linhaValoresMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 7,
    gap: 5,
  },

  valorGuardado: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: "#FFFFFF",
  },

  valorObjetivo: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 12,
    color: "#C7A9F5",
  },

  // HÁBITO DE GUARDAR
  areaGrafico: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -5,
    marginTop: 0,
  },

  resumoHabito: {
    backgroundColor: "rgba(20, 9, 41, 0.45)",
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginTop: 0,
    marginBottom: 12,
  },

  rotuloHabito: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 12,
    color: "#C7A9F5",
    marginBottom: 4,
  },

  valorHabito: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 20,
    color: Cores.destaque.limao,
  },

  listaMeses: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  itemMes: {
    width: "31%",
    flexGrow: 1,
    backgroundColor: "rgba(20, 9, 41, 0.35)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: "center",
  },

  nomeMes: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 11,
    color: "#C7A9F5",
    marginBottom: 3,
  },

  valorMes: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 11,
    color: "#FFFFFF",
    textAlign: "center",
  },

  valorMesAtual: {
    color: Cores.destaque.limao,
  },

  // DICA FINAL
  cardDica: {
    marginTop: 2,
    marginBottom: 0,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderColor: "rgba(163, 87, 255, 0.3)",
  },

  linhaDica: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  textoDica: {
    flex: 1,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    lineHeight: 21,
    color: "#FFFFFF",
  },

  textoDicaDestaque: {
    fontFamily: FONTS.quicksand.bold,
    color: Cores.destaque.limao,
  },

  vazio: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: "#C7A9F5",
    lineHeight: 21,
  },
});
