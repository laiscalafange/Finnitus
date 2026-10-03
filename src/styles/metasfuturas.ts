import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  // Container principal, ocupa a tela toda (fundo do gradiente)
  container: {
    flex: 1,
  },

  // Conteúdo do ScrollView: ocupa pelo menos a tela toda (flexGrow),
  // o que deixa o botão "Criar meta" no final da tela; se o conteúdo
  // ficar maior que a tela, a tela rola normalmente
  conteudo: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  // Bloco de conteúdo que "sobe" por cima do header (marginTop negativo)
  conteudoSobreHeader: {
    marginTop: -235,
    paddingHorizontal: 16,
    flexGrow: 1,
  },

  // Rótulo "Tipo de meta" (mesmo visual do label dos Inputs)
  rotuloTipo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginBottom: 8,
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
    marginBottom: 12,
  },

  // marginTop "auto" empurra o botão pro final da tela; o paddingTop
  // garante um respiro mínimo entre o último campo e o botão
  botaoContainer: {
    marginTop: "auto",
    paddingTop: 16,
  },
});