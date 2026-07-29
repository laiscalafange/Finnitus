import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Imagem de perfil
  imagem: {
    resizeMode: "cover",
  },

  // Fallback com iniciais do nome
  container: {
    backgroundColor: "#482287",
    alignItems: "center",
    justifyContent: "center",
  },

  iniciais: {
    color: "#B7FF00",
    fontWeight: "700",
  },

  // Fallback quando não há imagem nem nome
  vazio: {
    backgroundColor: "#2A2A3D",
    borderWidth: 1.5,
    borderColor: "#7E3BED",
  },
});