import { StyleSheet } from "react-native";
import { Cores } from "../../constants/Cores";
import { FONTS } from "../../constants/Tipografia";

export const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginBottom: 4,
  },

  // Reforço visual: opacidade um pouco mais forte que antes (0.5 -> 0.45)
  // pra ficar mais perceptível mesmo num card já translúcido
  wrapperLida: {
    opacity: 0.45,
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    // Cor de borda dinâmica: aplicada via array de style no componente,
    // não fixa aqui (ver cardNaoLida / cardLida abaixo)
  },

  // Borda verde-limão de destaque quando a notificação NÃO foi lida
  cardNaoLida: {
    borderColor: Cores.destaque.limao,
  },

  // Borda roxa neutra (a original) quando a notificação JÁ foi lida
  cardLida: {
    borderColor: "rgba(168, 79, 255, 0.28)",
  },

  icone: {
    width: 42,
    height: 42,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  textoContainer: {
    flex: 1,
  },

  mensagem: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    lineHeight: 19,
    color: Cores.base.branco,
  },

  tempo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 11,
    color: Cores.texto.secundario,
    marginTop: 6,
  },

  bolinhaNaoLida: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Cores.destaque.limao,
    position: "absolute",
    top: 12,
    right: 12,
  },
});