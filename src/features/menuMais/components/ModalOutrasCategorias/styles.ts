import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

// Overlay, card, X e título vêm de ModalReserva/styles.ts
export const styles = StyleSheet.create({
  // Altura máxima da lista: passando disso, ela rola dentro do modal
  lista: {
    maxHeight: 260,
    marginBottom: 8,
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    borderRadius: 12,
    backgroundColor: Cores.fundo.principal,
  },

  linhaMarcada: {
    borderColor: Cores.destaque.limao,
    backgroundColor: "rgba(183, 255, 0, 0.08)",
  },

  // Caixinha do checklist
  caixa: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    alignItems: "center",
    justifyContent: "center",
  },

  caixaMarcada: {
    borderColor: Cores.destaque.limao,
    backgroundColor: Cores.destaque.limao,
  },

  nome: {
    flex: 1,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.texto.claro,
  },

  nomeMarcado: {
    color: Cores.destaque.limao,
  },

  areaCriar: {
    marginTop: 8,
  },
});