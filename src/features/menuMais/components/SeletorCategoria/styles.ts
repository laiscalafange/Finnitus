import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },

  // Mesmo visual do label dos Inputs
  rotulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },

  // 3 colunas: o space-between distribui o espaço entre os itens
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  item: {
    width: "31.5%",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    borderRadius: 14,
    backgroundColor: Cores.fundo.principal,
  },

  // Categoria marcada: borda e texto em verde-limão (igual ao SelectCard)
  itemAtivo: {
    borderColor: Cores.destaque.limao,
    backgroundColor: "rgba(183, 255, 0, 0.08)",
  },

  emoji: {
    fontSize: 22,
  },

  nome: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  nomeAtivo: {
    color: Cores.destaque.limao,
  },
});