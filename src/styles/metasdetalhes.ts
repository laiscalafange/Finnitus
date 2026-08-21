import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 30,
  },

  conteudoSobreHeader: {
    marginTop: -340,
    paddingHorizontal: 16,
  },

  // Ícone principal da meta
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
    fontSize: 20,
    color: Cores.texto.principal,
    marginTop: 5,
  },

  valor: {
    textAlign: "center",
    fontFamily: FONTS.raleway.bold,
    fontSize: 32,
    color: Cores.destaque.limao,
  },

  metaTotal: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    marginTop: 5,
    color: Cores.texto.principal,
  },

  progresso: {
    marginTop: 12,
  },

  faltam: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.texto.principal,
    marginTop: 5,
    marginBottom: 15,
  },

  // Histórico
  historico: {
    marginTop: 5,
  },

  tituloHistorico: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 20,
    color: Cores.texto.principal,
  },

  data: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.principal,
    marginTop: 8,
    marginBottom: 5,
  },

  cardHistorico: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },

  linhaHistorico: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Ícone dentro do card
  iconeHistorico: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 12,
  },

  tipoDeposito: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 12,
    color: Cores.texto.principal,
  },

  horario: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 10,
    color: Cores.texto.principal,
  },

  valorDeposito: {
    marginLeft: "auto",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 11,
    color: Cores.texto.secundario,
  },

  verMais: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.texto.secundario,
    marginTop: 5,
    marginBottom: 10,
  },
});