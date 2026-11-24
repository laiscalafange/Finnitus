import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

const ESPACO = 6;

export const styles = StyleSheet.create({

  // ── CONTAINER PRINCIPAL ─────────────────

  container: {
    flex: 1,
  },

  conteudo: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  conteudoSobreHeader: {
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 14,
  },

  // ── CARD DO CALENDÁRIO ──────────────────

  cardCalendario: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.25)",
  },

  tituloCalendario: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 21,
    color: Cores.destaque.limao,
    marginBottom: 4,
  },

  subtituloCalendario: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 12,
    color: "#C7A9F5",
    lineHeight: 17,
    marginBottom: 18,
  },

  calendarioContainer: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },

  // ── DIAS DA SEMANA ──────────────────────

  linhaSemana: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: ESPACO,
    marginBottom: 12,
  },

  letraSemana: {
    flex: 1,
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: "#C7A9F5",
  },

  // ── CALENDÁRIO ─────────────────────────

  linhaDias: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: ESPACO,
    marginBottom: ESPACO,
  },

  dia: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  diaVazio: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "transparent",
  },

  diaNumero: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    textAlign: "center",
  },

  // ── CARD DA LEGENDA ─────────────────────

  cardLegenda: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.25)",
  },

  tituloLegenda: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 18,
    color: Cores.destaque.limao,
    marginBottom: 4,
  },

  subtituloLegenda: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 12,
    color: "#C7A9F5",
    marginBottom: 14,
  },

  linhaLegenda: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },

  itemLegenda: {
    width: "48.5%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgba(89, 48, 145, 0.45)",
  },

  quadradoLegenda: {
    width: 17,
    height: 17,
    borderRadius: 5,
  },

  textoLegenda: {
    flex: 1,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 12,
    color: Cores.base.branco,
  },

  // ── ESTADO SEM ATIVIDADE ────────────────

  vazio: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 12,
    color: "#C7A9F5",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 14,
    paddingHorizontal: 8,
  },

});