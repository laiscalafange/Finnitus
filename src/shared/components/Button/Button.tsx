import { Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { styles } from "./ButtonStyles";
import { ButtonProps } from "./ButtonTypes";

export function Button({
  titulo,
  variante = "primario",
}: ButtonProps) {
  const isPrimario = variante === "primario";

  return (
    <Pressable
      style={({ pressed }) => [
        pressed && { opacity: 0.8 },
      ]}
    >
      <LinearGradient
        colors={
          isPrimario
            ? ["#482287", "#7E3BED"]
            : ["transparent", "transparent"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.botaoBase,
          styles[variante],
        ]}
      >
        <Text
          style={[
            styles.textoBase,
            styles[`texto_${variante}`],
          ]}
        >
          {titulo}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}