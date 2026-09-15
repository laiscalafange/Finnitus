import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FONTS } from "../../constants/Tipografia";

export interface HeaderInternoProps {
  titulo: string;
  subtitulo: string;
}

export function HeaderInterno({
  titulo,
  subtitulo,
}: HeaderInternoProps) {
  // Hook de navegação do Expo Router
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#7c4dff', '#49269b', '#090312']}
      locations={[0, 0.50, 1]}
      start={{ x: 1.0, y: 0 }}
      end={{ x: 1.0, y: 1 }}
      style={styles.header}
    >
      {/* Título e subtítulo — recebidos por props, mudam de acordo
          com a tela que usa esse header (ex: "Metas" / "Detalhes") */}
      <View>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
      </View>

      {/* Ícones do canto superior direito */}
      <View style={styles.icones}>

        {/* Coroa — leva pra tela de assinatura Premium
            TODO: ajustar "/premium" pro nome real da rota, se for diferente */}
        <TouchableOpacity onPress={() => router.push("/Premium")}>
          <Image
            source={require("../../../../assets/icones/coroa.png")}
            style={styles.icone}
          />
        </TouchableOpacity>

        {/* Sino — leva pra tela de notificações
            TODO: ajustar "/notificacoes" pro nome real da rota, se for diferente */}
        <TouchableOpacity onPress={() => router.push("/Notificacao")}>
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
  // Faixa roxa do topo, com cantos bem arredondados embaixo
  // (mais alta que o HeaderPerfil, pra dar espaço ao conteúdo
  // que "sobe" por cima dela nas telas internas)
  header: {
    height: 400,

    paddingTop: 62,
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
    fontSize: 28,
    lineHeight: 30,
    fontFamily: FONTS.raleway.bold,
  },

  subtitulo: {
    color: "#B7FF00",
    fontSize: 20,
    lineHeight: 22,
    fontFamily: FONTS.raleway.regular,
    marginTop: 2,
  },

  // Container dos 2 ícones (coroa + sino)
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