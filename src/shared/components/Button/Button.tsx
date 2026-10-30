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
  tamanho = "padrao",
}: ButtonProps) {
  const isPrimario = variante === "primario";
  const isSecundario = variante === "secundario";

  // Compacto vale para os botões "cheios" (os de texto e o terciário não mudam)
  const compacto =
    tamanho === "compacto" &&
    variante !== "botaotexto" &&
    variante !== "terciario";

  // No compacto, "outline" e "secundario" viram o mesmo botão translúcido
  // com borda (igual ao Cancelar dos modais do Calendário)
  const translucido =
    compacto && (variante === "outline" || variante === "secundario");

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
          translucido
            ? ["transparent", "transparent"]
            : isPrimario
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
          compacto && styles.compacto,
          translucido && styles.compactoTranslucido,
        ]}
      >
        <View style={styles.conteudoBotao}>
          {icone}

          <Text
            numberOfLines={compacto ? 1 : undefined}
            adjustsFontSizeToFit={compacto}
            style={[
              styles.textoBase,
              styles[`texto_${variante}`],
              compacto && styles.textoCompacto,
              translucido && styles.textoCompactoTranslucido,
            ]}
          >
            {titulo}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}