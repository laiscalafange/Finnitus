import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  // Container principal, ocupa a tela toda (fundo do gradiente)
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 30,
  },

  // Bloco de conteúdo que "sobe" por cima do header (marginTop negativo)
  conteudoSobreHeader: {
    marginTop: -235,
    paddingHorizontal: 16,
    flex: 1,
  },

  titulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 24,
    color: Cores.destaque.limao,
    marginBottom: 15,
  },

  // Prefixo "R$" nos campos de valor (Valor objetivo / Valor inicial)
  prefixoMoeda: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
  },

  // Mensagem de erro de validação, acima do botão "Criar meta"
  erro: {
    color: "#ffb4b4",
    fontSize: 14,
    fontFamily: FONTS.quicksand.semibold,
    marginTop: 4,
  },

  // Empurra o botão "Confirmar" pro final da tela
  botaoContainer: {
    marginTop: 250,
    paddingBottom: 20,
  },
});