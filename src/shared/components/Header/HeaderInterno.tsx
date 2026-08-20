import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FONTS } from "../../constants/Tipografia";

export interface HeaderInternoProps {
  titulo: string;
  subtitulo: string;
}

export function HeaderInterno({
  titulo,
  subtitulo,
}: HeaderInternoProps) {
  return (
    <LinearGradient
      colors={['#7c4dff', '#49269b', '#090312']}
      locations={[0, 0.50, 1]}
      start={{ x: 1.0, y: 0 }}
      end={{ x: 1.0, y: 1 }}
      style={styles.header}
    >
      {/* Título */}
      <View>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
      </View>

      {/* Ícones */}
      <View style={styles.icones}>
        <TouchableOpacity>
          <Image
            source={require("../../../../assets/icones/coroa.png")}
            style={styles.icone}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require("../../../../assets/icones/sino.png")}
            style={styles.icone}
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 400,

    paddingTop: 20,
    paddingHorizontal: 20,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    borderBottomLeftRadius: 140,
    borderBottomRightRadius: 140,

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

  icones: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 3,
  },

  icone: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});