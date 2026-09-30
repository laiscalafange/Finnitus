import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

// Estilos compartilhados pelas telas de formulário do botão "+"
// (Novo imprevisto, Novo gasto e Novo evento). Segue o mesmo padrão das
// telas de conta (dadosBancarios, editarConta).
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
  // da faixa roxa do HeaderInterno
  formulario: {
    paddingHorizontal: 16,
    paddingTop: 40,
    marginTop: -300,
  },

  // Prefixo "R$" dos campos de valor (mesmo estilo da tela de criação de meta)
  prefixoMoeda: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
  },

  // Mensagem de erro de validação, acima dos botões
  erro: {
    color: "#ffb4b4",
    fontSize: 14,
    fontFamily: FONTS.quicksand.semibold,
    marginBottom: 12,
  },

  // Linha de "Repetir mensalmente" (texto + switch), com a mesma aparência
  // dos campos do Input
  linhaSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Cores.fundo.principal,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 64,
    marginBottom: 16,
  },

  textoSwitch: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },

  // Dois botões lado a lado (Cancelar | Salvar transação)
  linhaBotoes: {
    flexDirection: "row",
    gap: 12,
  },

  colunaBotao: {
    flex: 1,
  },
});