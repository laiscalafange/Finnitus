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

  // Área do conteúdo. O marginTop negativo faz tudo "subir" por cima
  // da faixa roxa do HeaderMP (cabeçalho das telas Premium e Metas)
  formulario: {
    paddingHorizontal: 16,
    paddingTop: 40,
    marginTop: -300,
  },

  // Validade e CVV lado a lado
  linhaCampos: {
    flexDirection: "row",
    gap: 12,
  },

  metade: {
    flex: 1,
  },

  // Card do Pix (no lugar do formulário do cartão)
  cardQr: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 16,
    marginBottom: 16,
  },

  // Quadradinho escuro em volta do ícone do QR Code
  caixaQr: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(13, 17, 18, 0.45)",
  },

  textoQr: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.base.branco,
    textAlign: "center",
  },

  // Resumo do plano (nome + preço + quando cobra)
  resumo: {
    marginBottom: 20,
    gap: 4,
  },

  linhaResumo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  resumoNome: {
    fontFamily: FONTS.quicksand.medium,
    fontSize: 15,
    color: Cores.texto.claro,
  },

  resumoPreco: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.base.branco,
  },

  resumoInfo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  // Mensagem de erro de validação acima do botão
  erro: {
    color: "#ffb4b4",
    fontSize: 14,
    fontFamily: FONTS.quicksand.semibold,
    marginBottom: 12,
  },
});