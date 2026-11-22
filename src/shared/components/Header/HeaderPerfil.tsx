import { useIdioma } from "@/features/idioma";
import { View, StyleSheet } from "react-native";
import { SinoNotificacoes } from "@/shared/components/SinoNotificacoes";
import { Text } from "@/shared/components/Texto";
import { LinearGradient } from "expo-linear-gradient";
import { FONTS } from "../../../shared/constants/Tipografia";
import { Cores } from "../../../shared/constants/Cores";
import { GRADIENTS } from "../../../shared/constants/Gradientes";
import { BotaoVoltar } from "../BotaoVoltar";

export function HeaderPerfil() {
  const { t } = useIdioma();

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
          <Text style={styles.titulo}>{t("Perfil")}</Text>
          <Text style={styles.subtitulo}>{t("Pessoal")}</Text>
        </View>
      </View>

      {/* Ícone do canto superior direito (só o sino — a coroa foi removida
          porque o card "Assine já" já leva pra tela Premium) */}
      <View style={styles.icones}>
        <SinoNotificacoes estiloIcone={styles.sino} />
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
