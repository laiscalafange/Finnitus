
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
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    padding: 16,
  },

  linhaIcone: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },

  iconeContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(183, 255, 0, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(183, 255, 0, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  textosTitulo: {
    flex: 1,
  },

  rotuloItem: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.base.branco,
    marginBottom: 4,
  },

  descricaoItem: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    lineHeight: 17,
    color: "#C6B2DD",
  },

  // SELETOR ESTILO NOVO EVENTO
  seletor: {
    minHeight: 48,
    backgroundColor: "rgba(13, 17, 18, 0.55)",
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
});
