import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  // Ocupa a tela toda (gradiente de fundo)
  container: {
    flex: 1,
  },

  // Conteúdo do ScrollView, só um espaço no final pra não colar no fim da tela
  conteudo: {
    paddingBottom: 30,
  },

  // Área da lista. O marginTop negativo faz o conteúdo "subir" por cima
  // da faixa roxa do HeaderInterno (mesmo padrão das outras telas de conta)
  lista: {
    paddingHorizontal: 16,
    paddingTop: 40,
    marginTop: -300,
  },

  tituloSecao: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.base.branco,
    marginBottom: 12,
  },

  // Cada pergunta é um Card (mesmo componente usado em outras telas),
  // com a mesma cor de fundo dos cards do Perfil
  // Fundo roxo translúcido igual ao dos cards de Notificações,
  // borda roxa (mesmo tom usado lá quando a notificação já foi lida)
  item: {
    padding: 0,
    overflow: "hidden",
    borderColor: "rgba(168, 79, 255, 0.35)",
  },

  // Cabeçalho clicável da pergunta (texto + seta)
  pergunta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  perguntaTexto: {
    flex: 1,
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.base.branco,
    marginRight: 12,
  },

  // Resposta, só aparece quando a pergunta está aberta
  respostaTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});