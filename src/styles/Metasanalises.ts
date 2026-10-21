import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Espaço no final pra o último card não colar no fim da tela
  conteudo: {
    paddingBottom: 30,
  },

  // Conteúdo logo abaixo do cabeçalho discreto (HeaderInterno)
  conteudoSobreHeader: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },

  // ---- Os 3 cards de resumo do topo ----

  linhaResumo: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  cardResumo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 0,
  },

  valorResumo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
  },

  rotuloResumo: {
    marginTop: 4,
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 11,
    color: Cores.texto.claro,
  },

  // ---- Cards com título (Progresso das metas e Hábito de guardar) ----

  tituloCard: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.destaque.limao,
    marginBottom: 14,
  },

  // Uma meta: ícone + nome + percentual, e a barra embaixo
  itemMeta: {
    marginBottom: 14,
  },

  linhaMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  nomeMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },

  textoNome: {
    flexShrink: 1,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  percentual: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.texto.claro,
  },

  percentualDestaque: {
    color: Cores.destaque.limao,
  },

  // ---- Card da dica no final ----

  cardDica: {
    borderColor: Cores.overlay.intenso,
    marginTop: 4,
  },

  linhaDica: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  textoDica: {
    flex: 1,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 15,
    lineHeight: 22,
    color: Cores.base.branco,
  },

  textoDicaDestaque: {
    fontFamily: FONTS.quicksand.bold,
    color: Cores.destaque.limao,
  },

  // Texto quando não há dados reais pra mostrar no card
  vazio: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.texto.claro,
  },
});