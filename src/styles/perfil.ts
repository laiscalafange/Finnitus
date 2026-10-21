import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

 // Container principal, ocupa a tela toda (o gradiente de fundo)
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

   // Conteúdo do ScrollView, só um espaço no final pra não colar no fim da tela
  conteudo: {
    paddingBottom: 30,
  },

  // Área do avatar + nome + username, centralizada
  // marginTop negativo pra "subir" e sobrepor só a curva de baixo do header.
  // O valor (-60) deixa o topo da foto abaixo do título "Perfil" e do
  // subtítulo "Pessoal" (que terminam por volta de 115px do topo).
  profile: {
    alignItems: "center",
    marginTop: -60,
  },

  nome: {
    marginTop: 0,
    color: Cores.roxo.principal,
    fontSize: 25,
    fontFamily: FONTS.raleway.bold,
  },

  usuario: {
    marginTop: 2,
    color: Cores.roxo.escuro,
    fontSize: 12,
    fontFamily: FONTS.raleway.regular
  },

  /* ESPAÇO DOS CARDS */

  // Padding lateral pra todos os cards não colarem na borda da tela
  conteudoCards: {
    paddingHorizontal: 12,
  },

  /* PREMIUM */

  premiumTituloContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardPremium: {
    marginTop: 20,
    padding: 12,
    borderRadius: 6,
  },

  premiumTitulo: {
    color: Cores.roxo.claro,
    fontSize: 19,
    fontFamily: FONTS.raleway.bold,
  },

  coroa: {
    width: 35,
    height: 35,
    marginRight: 10,
    resizeMode: "contain",
  },

  premiumVerde: {
    color: "#B8FF00",
  },

  premiumTexto: {
    color: Cores.roxo.claro,
    fontSize: 13,
    marginTop: 3,
    fontFamily: FONTS.raleway.regular,
  },

  botaoPremium: {
    height: 32,
    backgroundColor: Cores.roxo.claro,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  botaoTexto: {
    color: Cores.destaque.limao,
    fontSize: 18,
    fontFamily: FONTS.raleway.regular,
  },

  /* CARDS DE EDIÇÃO */

  // Linha com os 2 cards lado a lado, com espaço entre eles
  linhaCards: {
    flexDirection: "row",
    gap: 12,
  },

  cardEdicao: {
    flex: 1,
    height: 172,
    padding: 8,
    paddingRight: 0,
    borderRadius: 6,
  },

  cardTitulo: {
    color: Cores.roxo.claro,
    fontSize: 18,
    fontFamily: FONTS.raleway.bold,
  },

  EngrenagemPerfil: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    alignSelf: "flex-end",
    marginTop: 5,
  },

  BonecoPerfil: {
    width: 70,
    height: 105,
    resizeMode: "contain",
    alignSelf: "flex-end",
  },

  /* CONFIGURAÇÕES */

  cardConfiguracoes: {
    padding: 10,
    borderRadius: 6,
    marginTop: 0,
  },

  tituloSecao: {
    color: Cores.roxo.claro,
    fontSize: 20,
    fontFamily: FONTS.raleway.bold,
    marginBottom: 8,
  },

  // Cada linha clicável de configuração/suporte (ícone + texto)
  item: {
    flexDirection: "row",
    alignItems: "center",
    height: 38,
  },

  itemIcone: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 10,
  },

  itemTexto: {
    color: Cores.roxo.claro,
    fontSize: 15,
    fontFamily: FONTS.raleway.regular,
  },


  });