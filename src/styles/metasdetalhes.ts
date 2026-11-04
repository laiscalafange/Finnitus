
import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 120,
  },

  conteudoSobreHeader: {
    marginTop: -285,
    paddingHorizontal: 16,
  },

  iconeMeta: {
    alignSelf: "center",
    width: 120,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  cifrao: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  nomeMeta: {
    textAlign: "center",
    fontFamily: FONTS.raleway.bold,
    fontSize: 26,
    lineHeight: 32,
    color: Cores.texto.principal,
    marginTop: 8,
    marginBottom: 5,
  },

  valor: {
    textAlign: "center",
    fontFamily: FONTS.raleway.bold,
    fontSize: 34,
    color: Cores.destaque.limao,
  },

  metaTotal: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 15,
    marginTop: 5,
    color: Cores.texto.principal,
  },

  linhaProgresso: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  barraProgresso: {
    flex: 1,
  },

  percentual: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.texto.principal,
  },

  faltam: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.bold,
    fontSize: 19,
    color: Cores.texto.principal,
    marginTop: 12,
    marginBottom: 18,
  },

  linhaBotoes: {
    flexDirection: "row",
    gap: 12,
  },

  colunaBotao: {
    flex: 1,
  },

  botaoPrincipal: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.45)",
    backgroundColor: "#38205B",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  botaoSecundario: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.3)",
    backgroundColor: "rgba(163, 87, 255, 0.06)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  textoBotaoPrincipal: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.destaque.limao,
  },

  textoBotaoSecundario: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: "#C7A9F5",
  },

  botaoEditar: {
    marginBottom: 12,
  },

  botaoCancelar: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 90, 110, 0.55)",
    backgroundColor: "rgba(190, 45, 65, 0.13)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 12,
    marginBottom: 18,
  },

  textoBotaoCancelar: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: "#FF8795",
  },

  botaoPressionado: {
    opacity: 0.75,
  },

  // Mantidos para compatibilidade
  linhaCancelar: {
    alignItems: "flex-end",
    marginTop: -10,
    marginBottom: 16,
  },

  cancelarMeta: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: "#C7A9F5",
    textDecorationLine: "underline",
  },

  historico: {
    marginTop: 10,
  },

  tituloHistorico: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 25,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },

  data: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: "#C7A9F5",
    marginTop: 10,
    marginBottom: 7,
  },

  cardHistorico: {
    padding: 15,
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.25)",
  },

  linhaHistorico: {
    flexDirection: "row",
    alignItems: "center",
  },

  circuloHistorico: {
    marginRight: 12,
  },

  vazio: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.principal,
    marginTop: 8,
    marginBottom: 8,
  },

  tipoDeposito: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.texto.principal,
  },

  horario: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: "#C7A9F5",
    marginTop: 3,
  },

  valorDeposito: {
    marginLeft: "auto",
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
  },

  verMais: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: "#C7A9F5",
    marginTop: 8,
    marginBottom: 10,
  },
});
