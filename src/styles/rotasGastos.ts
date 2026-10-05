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

  // Conteúdo "sobe" por cima da faixa roxa do HeaderInterno
  conteudoSobreHeader: {
    marginTop: -300,
    paddingTop: 40,
    paddingHorizontal: 16,
  },

  // ---- Compartilhado entre as duas versões ----

  tituloSecao: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },

  // Legenda do gráfico / das barras (bolinha + texto)
  legenda: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginTop: 4,
  },

  itemLegenda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  bolinhaLegenda: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  textoLegenda: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  categoriaNome: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.base.branco,
  },

  // ---- Versão "Gastos atuais" ----

  // Uma categoria do gráfico: nome à esquerda e as duas barras ao lado
  linhaGrafico: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  rotuloGrafico: {
    width: 90,
    fontFamily: FONTS.quicksand.medium,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  barrasGrafico: {
    flex: 1,
    gap: 4,
  },

  // Card de cada categoria: textos à esquerda e variação à direita
  cardCategoria: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textosCategoria: {
    flex: 1,
    gap: 4,
  },

  categoriaDetalhe: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  variacao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  variacaoTexto: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 16,
  },

  // ---- Versão "Recomendado" ----

  // Card de destaque no topo (quanto dá pra economizar)
  cardHero: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 22,
  },

  heroRotulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.texto.claro,
  },

  heroValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 34,
    color: Cores.destaque.limao,
  },

  heroDescricao: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.medium,
    fontSize: 13,
    lineHeight: 19,
    color: Cores.texto.claro,
  },

  // "Hoje  →  Com o plano"
  heroLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Cores.overlay.medio,
    alignSelf: "stretch",
  },

  heroColuna: {
    alignItems: "center",
    gap: 2,
  },

  heroColunaRotulo: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  heroColunaValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.base.branco,
  },

  // Topo de cada categoria: ícone + nome à esquerda e selo à direita
  topoRota: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  nomeRota: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },

  // Selo: "Reduzir R$ 300,00" / "Dentro do ideal" / "No limite"
  selo: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  seloTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
  },

  // "Hoje R$ ..." à esquerda e "Recomendado R$ ..." à direita, embaixo da barra
  valoresRota: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  valorRotaTexto: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  valorRotaDestaque: {
    fontFamily: FONTS.quicksand.bold,
    color: Cores.base.branco,
  },

  // Quanto reduzir por dia / folga do mês
  resultadoRota: {
    marginTop: 12,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
  },

  dicaRota: {
    marginTop: 4,
    fontFamily: FONTS.quicksand.medium,
    fontSize: 13,
    lineHeight: 19,
    color: Cores.texto.claro,
  },

  // Dica final
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

  // ---- Quando não há o que mostrar (sem gastos ou sem renda) ----

  cardVazio: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 22,
  },

  tituloVazio: {
    textAlign: "center",
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
  },

  textoVazio: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.medium,
    fontSize: 13,
    lineHeight: 19,
    color: Cores.texto.claro,
  },

  // ---- Resumo (no final de cada versão) ----

  textoResumo: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    lineHeight: 22,
    color: Cores.base.branco,
  },
});