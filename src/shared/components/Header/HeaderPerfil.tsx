import React from "react";
import {View,Text,StyleSheet,TouchableOpacity,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function HeaderPerfil() {
  return (
    <LinearGradient
      colors={["#8f4df9", "#A357FF"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.header}
    >
      {/* Título */}
      <View>
        <Text style={styles.titulo}>Perfil</Text>
        <Text style={styles.subtitulo}>Pessoal</Text>
      </View>

      {/* Ícones */}
      <View style={styles.icones}>

        {/* Premium */}
        <TouchableOpacity>
          <Text style={styles.coroa}>👑</Text>
        </TouchableOpacity>

        {/* Sino */}
        <TouchableOpacity>
          <Text style={styles.sino}>🔔</Text>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 25,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#B7FF00",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: -2,
  },

  icones: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 3,
  },

  sino: {
    fontSize: 18,
  },

  coroa: {
    fontSize: 22,
  },
});