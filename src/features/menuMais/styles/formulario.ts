
import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Menos espaço desperdiçado no final
  conteudo: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  // Formulário mais próximo do cabeçalho
  formulario: {
    paddingHorizontal: 18,
    paddingTop: 2,
    paddingBottom: 12,
    gap: 10,
  },

  // Prefixo monetário discreto, mantendo o destaque verde
  prefixoMoeda: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.destaque.limao,
  },

  // Erros legíveis sem ocupar muito espaço
  erro: {
    color: "#FFB4B4",
    fontSize: 13,
    fontFamily: FONTS.quicksand.semibold,
    marginTop: 2,
    marginBottom: 4,
  },

  // Caixa mais compacta e com roxo suave
  linhaSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "rgba(29, 19, 44, 0.78)",

    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.30)",
    borderRadius: 12,

    paddingHorizontal: 14,
    minHeight: 52,

    marginTop: 2,
    marginBottom: 6,
  },

  textoSwitch: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  // Texto auxiliar do Novo evento
  textoAjuda: {
    fontFamily: FONTS.quicksand.medium,
    color: "#C7A9F5",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 0,
    marginBottom: 6,
    paddingHorizontal: 2,
  },

  // Botões mais próximos e equilibrados
  linhaBotoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },

  colunaBotao: {
    flex: 1,
    minWidth: 0,
  },
});
