import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text } from "@/shared/components/Texto";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FONTS } from "../../../shared/constants/Tipografia";
import { Cores } from "../../../shared/constants/Cores";
import { GRADIENTS } from "../../../shared/constants/Gradientes";
import { Rotas } from "../../../shared/constants/Rotas";
import { BotaoVoltar } from "../BotaoVoltar";

export function HeaderPerfil() {
  // Hook de navegação do Expo Router
  const router = useRouter();

  return (
    <LinearGradient
      colors={GRADIENTS.header.colors}
      start={GRADIENTS.header.start}
      end={GRADIENTS.header.end}
      style={styles.header}
    >
      {/* Lado esquerdo: seta de voltar (roxo escuro) + título */}
      <View style={styles.esquerda}>
        <BotaoVoltar />

        <View>
          <Text style={styles.titulo}>Perfil</Text>
          <Text style={styles.subtitulo}>Pessoal</Text>
        </View>
      </View>

      {/* Ícone do canto superior direito (só o sino — a coroa foi removida
          porque o card "Assine já" já leva pra tela Premium) */}
      <View style={styles.icones}>

        {/* Sino — leva pra tela de notificações */}
        <TouchableOpacity onPress={() => router.push(Rotas.notificacao)}>
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

    paddingTop: 62,
    paddingHorizontal: 20,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    borderBottomLeftRadius: 110,
    borderBottomRightRadius: 110,

    overflow: "hidden",
  },

  // Seta de voltar + bloco de título/subtítulo, lado a lado
  esquerda: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  titulo: {
    color: Cores.destaque.limao,
    fontSize: 28,
    lineHeight: 30,
    fontFamily: FONTS.raleway.bold,
  },

  subtitulo: {
    color: Cores.destaque.limao,
    fontSize: 20,
    fontFamily: FONTS.raleway.regular,
    marginTop: -1,
  },

  // Container dos ícones do canto direito (só o sino)
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
});