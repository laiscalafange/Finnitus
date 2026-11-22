import { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Image, StyleSheet, TouchableOpacity, View,
  type ImageStyle, type StyleProp,
} from "react-native";

import { useIdioma } from "@/features/idioma";
import { useNotificacoes } from "@/features/contas/useNotificacoes";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";
import { Rotas } from "@/shared/constants/Rotas";
import { Text } from "./Texto";

export function SinoNotificacoes({ estiloIcone, onPress }: {
  estiloIcone?: StyleProp<ImageStyle>;
  onPress?: () => void;
}) {
  const router = useRouter();
  const { t } = useIdioma();
  const { totalNaoLidas, carregar } = useNotificacoes();
  const rotulo = totalNaoLidas === 0 ? t("Abrir notificações")
    : totalNaoLidas === 1 ? t("Abrir notificações, 1 não lida")
    : t("Abrir notificações, {total} não lidas", { total: totalNaoLidas });

  useFocusEffect(useCallback(() => {
    void carregar();
  }, [carregar]));

  return (
    <TouchableOpacity
      style={styles.sino}
      onPress={onPress ?? (() => router.push(Rotas.notificacao))}
      activeOpacity={0.75}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
    >
      <Image source={require("../../../assets/icones/sino.png")} style={[styles.icone, estiloIcone]} />
      {totalNaoLidas > 0 && (
        <View style={styles.contador} pointerEvents="none" importantForAccessibility="no-hide-descendants">
          <Text style={styles.contadorTexto} allowFontScaling={false} numberOfLines={1}>
            {totalNaoLidas > 99 ? "99+" : totalNaoLidas}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sino: {
    position: "relative",
  },
  icone: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  contador: {
    position: "absolute",
    top: -8,
    right: -8,
    minWidth: 19,
    minHeight: 19,
    paddingHorizontal: 3,
    borderRadius: 12,
    backgroundColor: Cores.destaque.limao,
    alignItems: "center",
    justifyContent: "center",
  },
  contadorTexto: {
    color: Cores.base.preto,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 10,
    lineHeight: 13,
  },
});
