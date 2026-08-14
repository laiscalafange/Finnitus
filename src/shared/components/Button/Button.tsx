import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { styles } from "./ButtonStyles";
import { ButtonProps } from "./ButtonTypes";

export function Button({
  titulo,
  icone,
  variante = "primario",
  onPress,
}: ButtonProps) {
  const isPrimario = variante === "primario";

  return (
    <Pressable
      style={({ pressed }) => [
        pressed && { opacity: 0.8 },
      ]}
      onPress={onPress}
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