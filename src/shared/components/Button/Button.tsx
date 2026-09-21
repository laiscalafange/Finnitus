import {
  Pressable,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { styles } from "./ButtonStyles";
import type { ButtonProps } from "./ButtonTypes";

export function Button({
  titulo,
  icone,
  variante = "primario",
  onPress,
  disabled = false,
}: ButtonProps) {
  const isPrimario = variante === "primario";
  const isSecundario = variante === "secundario";

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      style={({ pressed }) => [
        pressed && { opacity: 0.8 },
        disabled && { opacity: 0.5 },
      ]}
    >
      <LinearGradient
        colors={
          isPrimario
            ? ["#482287", "#7E3BED"]
            : isSecundario
              ? ["#6931c5", "#482287"]
              : ["transparent", "transparent"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.botaoBase,
          styles[variante],
        ]}
      >
        <View style={styles.conteudoBotao}>
          {icone}

          <Text
            style={[
              styles.textoBase,
              styles[`texto_${variante}`],
            ]}
          >
            {titulo}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}