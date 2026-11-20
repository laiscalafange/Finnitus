
import { StyleSheet } from "react-native";
import { FONTS } from "@/shared/constants/Tipografia";

const ROXO_CLARO = "#D9C5F5";
const TEXTO_BRANCO = "#F5F0FF";
const VERDE_LIMAO = "#B7FF00";
const BORDA = "rgba(163, 87, 255, 0.22)";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 30,
  },

  profile: {
    alignItems: "center",
    marginTop: -60,
    paddingHorizontal: 20,
  },

  nome: {
    marginTop: 10,
    color: TEXTO_BRANCO,
    fontSize: 23,
    fontFamily: FONTS.raleway.bold,
    textAlign: "center",
  },

  usuario: {
    marginTop: 4,
    color: ROXO_CLARO,
    fontSize: 12,
    fontFamily: FONTS.raleway.regular,
    textAlign: "center",
  },

  mensagemSalvando: {
    color: VERDE_LIMAO,
    marginTop: 10,
    fontFamily: FONTS.raleway.regular,
  },

  mensagemErro: {
    color: "#FF7777",
    marginTop: 10,
    textAlign: "center",
    fontFamily: FONTS.raleway.regular,
  },

  conteudoCards: {
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },

  cardPremium: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDA,
  },

  premiumTituloContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  premiumTitulo: {
    color: VERDE_LIMAO,
    fontSize: 19,
    fontFamily: FONTS.raleway.bold,
  },

  coroa: {
    width: 32,
    height: 32,
    marginRight: 10,
    resizeMode: "contain",
  },

  premiumVerde: {
    color: VERDE_LIMAO,
  },

  premiumTexto: {
    color: ROXO_CLARO,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
    fontFamily: FONTS.raleway.regular,
  },

  botaoPremium: {
    minHeight: 40,
    backgroundColor: "#7529d2",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: FONTS.raleway.bold,
  },

  cardEdicao: {
    minHeight: 108,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDA,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  conteudoEdicao: {
    flex: 1,
    paddingRight: 10,
  },

  cardTitulo: {
    color: TEXTO_BRANCO,
    fontSize: 18,
    fontFamily: FONTS.raleway.bold,
  },

  cardDescricao: {
    color: ROXO_CLARO,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    fontFamily: FONTS.raleway.regular,
  },

  EngrenagemPerfil: {
    width: 78,
    height: 78,
    resizeMode: "contain",
  },

  cardConfiguracoes: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDA,
  },

  tituloSecao: {
    color: VERDE_LIMAO,
    fontSize: 18,
    fontFamily: FONTS.raleway.bold,
    marginBottom: 8,
     marginTop: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(163, 87, 255, 0.13)",
  },

  ultimoItem: {
    borderBottomWidth: 0,
  },

  itemIcone: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 12,
  },

  itemTexto: {
    color: ROXO_CLARO,
    fontSize: 15,
    fontFamily: FONTS.raleway.regular,
  },

  acoesConta: {
    marginTop: 8,
    gap: 12,
  },
});
