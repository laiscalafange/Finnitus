
import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 40,
  },

  lista: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.13)",
    padding: 16,
  },

  linhaIcone: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 10,
  },

  rotuloItem: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  espacoTopo: {
    marginTop: 20,
  },

  // SELETOR ESTILO NOVO EVENTO
  seletor: {
    minHeight: 48,
    backgroundColor: "rgba(13, 17, 18, 0.43)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.35)",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  seletorAberto: {
    borderColor: Cores.destaque.limao,
  },

  valorSelecionado: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  opcoesContainer: {
    backgroundColor: "rgba(13, 17, 18, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.30)",
    borderRadius: 12,
    marginTop: 6,
    padding: 5,
  },

  opcao: {
    minHeight: 43,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  opcaoAtiva: {
    backgroundColor: "rgba(183, 255, 0, 0.09)",
  },

  textoOpcao: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: "#D9C5F5",
  },

  textoOpcaoAtiva: {
    color: Cores.destaque.limao,
  },

  divisor: {
    height: 1,
    backgroundColor: "rgba(163, 87, 255, 0.18)",
    marginVertical: 20,
  },

  linhaSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textoSwitchContainer: {
    flex: 1,
    marginRight: 12,
  },

  rotuloSwitch: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  descricaoSwitch: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    lineHeight: 17,
    color: "#C6B2DD",
    marginTop: 4,
  },

  // CARD DE PERIGO SEPARADO
  cardPerigo: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255, 65, 80, 0.09)",
    borderWidth: 1,
    borderColor: "rgba(255, 100, 110, 0.30)",
  },

  iconePerigoContainer: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "rgba(255, 85, 95, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  textosPerigo: {
    flex: 1,
  },

  tituloPerigo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: "#FF8585",
    marginBottom: 4,
  },

  descricaoPerigo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: "#D4A4AB",
  },
});
