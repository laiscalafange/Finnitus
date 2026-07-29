import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Fundo escurecido
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  // Caixa centralizada
  caixa: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#181828",
    borderRadius: 12,
    padding: 24,
  },

  titulo: {
    fontWeight: "700",
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 8,
  },

  mensagem: {
    fontSize: 14,
    color: "#C7C7D1",
    marginBottom: 20,
  },

  acoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  botao: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoCancelar: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#7E3BED",
  },

  botaoConfirmar: {
    backgroundColor: "#482287",
  },

  textoCancelar: {
    fontWeight: "700",
    fontSize: 14,
    color: "#7E3BED",
  },

  textoConfirmar: {
    fontWeight: "700",
    fontSize: 14,
    color: "#B7FF00",
  },
});