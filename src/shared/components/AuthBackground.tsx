import { StyleSheet, View } from "react-native";
import { BackgroundGradient } from "./backgroundGradient";

/**
 * Android/iOS: reutiliza o gradiente SVG original do Finnitus.
 * Esta camada e puramente decorativa e nao bloqueia interacoes.
 * Expo Web usa automaticamente AuthBackground.web.tsx.
 */
export function AuthBackground() {
  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <BackgroundGradient variante="padrao" />
    </View>
  );
}
