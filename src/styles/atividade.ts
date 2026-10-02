import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

// Espaço entre os quadradinhos do calendário
const ESPACO = 8;

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
    paddingTop: 30,
    paddingHorizontal: 16,
  },

  // Letras dos dias da semana (S T Q Q S S D)
  linhaSemana: {
    flexDirection: "row",
    gap: ESPACO,
    marginBottom: 10,
  },

  letraSemana: {
    flex: 1,
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  // Cada linha do calendário (7 dias)
  linhaDias: {
    flexDirection: "row",
    gap: ESPACO,
    marginBottom: ESPACO,
  },

  // Quadradinho de um dia (a cor muda conforme o nível de atividade)
  dia: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  // Espaço vazio antes do dia 1 / depois do último dia
  diaVazio: {
    flex: 1,
    aspectRatio: 1,
  },

  diaNumero: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
  },

  // Card da legenda
  tituloLegenda: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.base.branco,
    marginBottom: 12,
  },

  linhaLegenda: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  itemLegenda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  quadradoLegenda: {
    width: 16,
    height: 16,
    borderRadius: 5,
  },

  textoLegenda: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  vazio: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 14,
    color: Cores.texto.claro,
    textAlign: "center",
    marginTop: 20,
  },
});