import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FONTS } from "../../../shared/constants/Tipografia";

export function HeaderPerfil() {
  // Hook de navegação do Expo Router
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#7c4dff", "#6c43dd"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.header}
    >
      {/* Título */}
      <View>
        <Text style={styles.titulo}>Perfil</Text>
        <Text style={styles.subtitulo}>Pessoal</Text>
      </View>

      {/* Ícones do canto superior direito */}
      <View style={styles.icones}>

        {/* Coroa — leva pra tela de assinatura Premium
            TODO: ajustar "/premium" pro nome real da rota, se for diferente */}
        <TouchableOpacity onPress={() => router.push("/Premium")}>
          <Image
            source={require("../../../../assets/icones/coroa.png")}
            style={styles.coroa}
          />
        </TouchableOpacity>

        {/* Sino — leva pra tela de notificações
            TODO: ajustar "/notificacoes" pro nome real da rota, se for diferente */}
        <TouchableOpacity onPress={() => router.push("/Notificacao")}>
          <Image
            source={require("../../../../assets/icones/sino.png")}
            style={styles.sino}
          />
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Faixa roxa do topo, com cantos arredondados embaixo
  header: {
    height: 190,

    paddingTop: 20,
    paddingHorizontal: 20,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    borderBottomLeftRadius: 110,
    borderBottomRightRadius: 110,

    overflow: "hidden",
  },

  titulo: {
    color: "#B7FF00",
    fontSize: 27,
    fontFamily: FONTS.raleway.bold,
  },

  subtitulo: {
    color: "#B7FF00",
    fontSize: 12,
    fontFamily: FONTS.raleway.regular,
    marginTop: -2,
  },

  // Container dos 2 ícones (coroa + sino)
  icones: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 3,
  },

  sino: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  coroa: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});