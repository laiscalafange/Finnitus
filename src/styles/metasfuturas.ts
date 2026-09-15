import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  // Container principal, ocupa a tela toda (fundo do gradiente)
  container: {
    flex: 1,
  },

  // Não estava sendo usado no arquivo original (não tinha ScrollView),
  // mantido aqui só caso decida adicionar um ScrollView depois
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

  // Ícone do campo "Salário" (cifrão)
  iconeInput: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  // Ícone do campo "Despesas" (cifrão proibido) — um pouco maior que o outro
  iconeInputs: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },

  // Empurra o botão "Confirmar" pro final da tela
  botaoContainer: {
    marginTop: 250,
    paddingBottom: 20,
  },
});