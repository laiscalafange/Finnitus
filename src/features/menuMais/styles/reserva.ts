import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

// Estilos da tela Reserva de emergência. O container, o conteúdo do scroll e
// a área que sobe por cima do header vêm de styles/formulario.ts (mesmo padrão).
export const styles = StyleSheet.create({
  // Bordas dos cards no mesmo tom do card flutuante (ModalConfirmarAcao)
  card: {
    borderColor: "rgba(168, 79, 255, 0.35)",
  },

  // ---- Card "Reserva disponível" ----

  linhaSaldo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  rotuloPequeno: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.texto.claro,
  },

  valorSaldo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 26,
    color: Cores.base.branco,
  },

  // ---- Card "Meta da reserva" ----

  linhaMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  // Botãozinho "Definir meta" no canto do card
  chipMeta: {
    borderWidth: 1,
    borderColor: Cores.roxo.claro,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  textoChipMeta: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: Cores.roxo.claro,
  },

  valorMeta: {
    fontFamily: FONTS.raleway.semibold,
    fontSize: 20,
    color: Cores.base.branco,
    marginBottom: 12,
  },

  linhaProgresso: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  barraProgresso: {
    flex: 1,
  },

  percentual: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  // ---- Botões Depositar | Retirar ----

  linhaBotoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },

  colunaBotao: {
    flex: 1,
  },

  // ---- Últimas movimentações ----

  tituloSecao: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.texto.claro,
    marginTop: 8,
    marginBottom: 12,
  },

  semMovimentacoes: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.texto.claro,
    marginBottom: 12,
  },

  linhaMovimentacao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  // Círculo com o + (depósito) ou − (retirada)
  circuloMovimentacao: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  circuloDeposito: {
    backgroundColor: "rgba(107, 195, 0, 0.25)",
  },

  circuloRetirada: {
    backgroundColor: "rgba(155, 119, 255, 0.25)",
  },

  textosMovimentacao: {
    flex: 1,
  },

  valorMovimentacao: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  valorRetirada: {
    color: Cores.texto.principal,
  },

  tipoMovimentacao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  dataMovimentacao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.texto.claro,
  },
});