
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
    borderColor: "rgba(163, 87, 255, 0.22)",
    padding: 16,
  },

  cabecalhoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
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

  textosCabecalho: {
    flex: 1,
  },

  tituloCard: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  descricaoCard: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    lineHeight: 17,
    color: "#C6B2DD",
    marginTop: 4,
  },

  // BOTÃO ESTILO NOVO EVENTO
  botao: {
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

  textoBotao: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  // AUTENTICAÇÃO EM DUAS ETAPAS
  linha2fa: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  textoContainer2fa: {
    flex: 1,
  },

  // DISPOSITIVOS
  dispositivo: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 66,
    paddingVertical: 12,
  },

  dispositivoDivisor: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(163, 87, 255, 0.15)",
  },

  iconeDispositivo: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "rgba(183, 255, 0, 0.07)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  dispositivoTextos: {
    flex: 1,
  },

  dispositivoNomeLinha: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
  },

  dispositivoNome: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 13,
    color: Cores.base.branco,
  },

  dispositivoLocal: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 11,
    color: "#C6B2DD",
    marginTop: 4,
  },

  selo: {
    backgroundColor: "rgba(183, 255, 0, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(183, 255, 0, 0.25)",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  seloTexto: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 10,
    color: Cores.destaque.limao,
  },

  desconectar: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 12,
    color: "#FF8585",
    marginLeft: 6,
  },

  // ÁREA DE PERIGO
  cardExcluir: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 80,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255, 65, 80, 0.09)",
    borderWidth: 1,
    borderColor: "rgba(255, 100, 110, 0.30)",
  },

  iconePerigoContainer: {
    width: 42,
    height: 42,
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
    lineHeight: 17,
    color: "#D4A4AB",
  },
});
9