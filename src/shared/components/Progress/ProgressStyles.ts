import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Trilha (fundo) da barra de progresso
  trilha: {
    width: "100%",
    overflow: "hidden",
  },

  // Preenchimento proporcional ao valor
  // largura, altura e cor definidas dinamicamente via props no componente
  preenchimento: {},
});