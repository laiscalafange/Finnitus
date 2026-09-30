import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  // Mesmo escurecimento do fundo do menu do + na barra de navegação
  fundo: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  // O Card já vem com marginBottom; aqui zera pra centralizar direito
  card: {
    borderColor: "rgba(168, 79, 255, 0.35)",
    marginBottom: 0,
    paddingTop: 22,
  },

  // X de fechar, no canto superior direito
  fechar: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 2,
  },

  // ---- Cards com campo de valor (alinhados à esquerda) ----

  titulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 22,
    color: Cores.destaque.limao,
    paddingRight: 28,
    marginBottom: 12,
  },

  pergunta: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 15,
    color: Cores.texto.claro,
    marginBottom: 10,
  },

  // Prefixo "R$" do campo de valor
  prefixoMoeda: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
  },

  // "Saldo atual: R$ ..." abaixo do campo
  dica: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.claro,
    marginTop: -6,
    marginBottom: 18,
  },

  // ---- Cards com ícone (centralizados) ----

  centralizado: {
    alignItems: "center",
  },

  iconeTopo: {
    marginBottom: 14,
  },

  imagemIcone: {
    width: 64,
    height: 64,
  },

  tituloCentro: {
    textAlign: "center",
    paddingRight: 0,
  },

  texto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
    textAlign: "center",
    marginBottom: 20,
  },

  botoes: {
    alignSelf: "stretch",
  },
});