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

  // Área do conteúdo, logo abaixo do cabeçalho discreto (HeaderInterno)
  lista: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // Cada seção (trocar senha, 2FA, dispositivos, excluir conta) é um Card,
  // com o mesmo fundo/borda roxos usados nos cards da tela Ajuda
  card: {
    marginBottom: 16,
    borderColor: "rgba(168, 79, 255, 0.35)",
  },

  // Card de "Excluir conta": borda vermelha de alerta, em vez da roxa padrão
  cardExcluir: {
    borderColor: "rgba(239, 68, 68, 0.4)",
  },

  tituloCard: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginBottom: 4,
  },

  // --- Autenticação em duas etapas ---
  linha2fa: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textoContainer2fa: {
    flex: 1,
    marginRight: 12,
  },

  descricao2fa: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: Cores.texto.claro,
    marginTop: 4,
  },

  // --- Dispositivos conectados ---
  dispositivo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 12,
  },

  dispositivoTextos: {
    flex: 1,
  },

  dispositivoNomeLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  dispositivoNome: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  dispositivoLocal: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.texto.claro,
    marginTop: 2,
  },

  // Selo "Este" no aparelho atual
  selo: {
    backgroundColor: Cores.destaque.limao,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  seloTexto: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 11,
    color: Cores.texto.contraste,
  },

  desconectar: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.estado.erro,
  },

  // --- Excluir conta ---
  descricaoExcluir: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: Cores.texto.claro,
    marginBottom: 12,
  },
});