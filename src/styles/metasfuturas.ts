
import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Conteúdo rolável, sem forçar o botão ao fim da tela
  conteudo: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // Mantém o formulário próximo ao cabeçalho
  conteudoSobreHeader: {
    marginTop: -235,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },

  // Agrupa o seletor de tipo de meta
  blocoTipo: {
    marginBottom: 4,
  },

  rotuloTipo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },

  prefixoMoeda: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
  },

  erro: {
    color: "#FFB4B4",
    fontSize: 13,
    fontFamily: FONTS.quicksand.semibold,
    marginTop: 2,
    marginBottom: 4,
  },

  // Botão logo após o último campo
  botaoContainer: {
    marginTop: 8,
    paddingBottom: 8,
  },
});
