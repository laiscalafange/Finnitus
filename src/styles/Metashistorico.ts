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
    paddingHorizontal: 19,
  },

  // Card de cada meta (o Card já traz borda e raio)
card: {
  paddingTop: 10,
  paddingHorizontal: 12,
  paddingBottom: -10,
},

  // Espaço entre a linha do card e o botão "Desfazer"
  botaoDesfazer: {
    marginTop: 10,
  },

  linhaCard: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},

  // Quadradinho escuro em volta do ícone
  caixaIcone: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(13, 17, 18, 0.45)",
  },

  textos: {
    flex: 1,
    gap: 1,
  },

  // Nome + selo de status, lado a lado
  linhaTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  nome: {
    flex: 1,
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.base.branco,
  },

  detalhe: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  // Selo "Concluída" / "Cancelada"
  selo: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },

  seloConcluida: {
    backgroundColor: "rgba(183, 255, 0, 0.18)",
  },

  seloCancelada: {
    backgroundColor: Cores.overlay.medio,
  },

  seloTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 11,
  },

  seloTextoConcluida: {
    color: Cores.destaque.limao,
  },

  seloTextoCancelada: {
    color: Cores.texto.claro,
  },

  vazio: {
    marginTop: 24,
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.texto.claro,
  },
});