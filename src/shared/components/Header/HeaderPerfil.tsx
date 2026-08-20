import React from "react";
import {View,Text,StyleSheet,TouchableOpacity,Image} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FONTS } from "../../../shared/constants/Tipografia";

export function HeaderPerfil() {
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

      {/* Ícones */}
      <View style={styles.icones}>

        {/* Premium */}
        <TouchableOpacity>
         <Image
          source={require("../../../../assets/icones/coroa.png")}
          style={styles.coroa}
          />
        </TouchableOpacity>

        {/* Sino */}
        <TouchableOpacity>
         <Image
          source={require("../../../../assets/icones/sino.png")}
          style={styles.coroa}
          />
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