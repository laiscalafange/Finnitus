import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  // Ocupa a tela toda (gradiente de fundo + área do teclado)
  container: {
    flex: 1,
  },

  // Conteúdo do ScrollView, só um espaço no final pra não colar no fim da tela
  conteudo: {
    paddingBottom: 30,
  },

  // Área dos campos. O marginTop negativo faz o formulário "subir" por cima
  // da faixa roxa do HeaderInterno (mesmo padrão das outras telas de conta)
  formulario: {
    paddingHorizontal: 16,
    paddingTop: 40,
    marginTop: -300,
  },

  // Mensagem de erro acima do botão
  erro: {
    color: "#ffb4b4",
    fontSize: 14,
    fontFamily: FONTS.quicksand.semibold,
    marginBottom: 12,
  },

  // Confirmação de envio (mensagem enviada com sucesso)
  confirmacao: {
    color: Cores.destaque.limao,
    fontSize: 14,
    fontFamily: FONTS.quicksand.semibold,
    marginBottom: 12,
  },
});