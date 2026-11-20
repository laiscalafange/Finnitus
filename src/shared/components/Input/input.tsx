import { useState } from "react";

import {
  View,
  Pressable,
  StyleSheet,
} from "react-native";
import { Text, TextInput } from "@/shared/components/Texto";

import { Eye, EyeOff } from "lucide-react-native";

import { Cores } from "../../constants/Cores";
import { styles } from "./InputStyles";
import type { InputProps } from "./InputTypes";

export function Input({
  label,
  erro,
  icone,
  placeholder,
  secureTextEntry = false,
  keyboardType,
  value,
  onChangeText,
  autoCapitalize = "none",
  autoCorrect = false,
  autoComplete,
  editable = true,
  maxLength,
  multiline = false,
  numberOfLines,
}: InputProps) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label} maxFontSizeMultiplier={1.15}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.campo,
          multiline ? styles.campoMultilinha : null,
          erro ? styles.campoErro : null,
        ]}
      >
        {icone ? (
          <View style={styles.icone}>
            {icone}
          </View>
        ) : null}

        <TextInput
          style={[
            styles.input,
            multiline ? styles.inputMultilinha : null,
          ]}
          // Limita o aumento da fonte do sistema para o texto não passar do campo
          maxFontSizeMultiplier={1.15}
          multiline={multiline}
          numberOfLines={numberOfLines}
          accessibilityLabel={label}
          placeholder={placeholder}
          placeholderTextColor={Cores.texto.desabilitado}
          secureTextEntry={secureTextEntry && !senhaVisivel}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          editable={editable}
          maxLength={maxLength}
        />

        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              senhaVisivel ? "Ocultar senha" : "Mostrar senha"
            }
            accessibilityState={{ disabled: !editable }}
            disabled={!editable}
            onPress={() => setSenhaVisivel((visivel) => !visivel)}
            style={({ pressed }) => [
              visibilityStyles.botao,
              {
                opacity: !editable
                  ? 0.4
                  : pressed
                    ? 0.6
                    : 1,
              },
            ]}
          >
            {senhaVisivel ? (
              <EyeOff
                size={22}
                color={Cores.roxo.claro}
              />
            ) : (
              <Eye
                size={22}
                color={Cores.roxo.claro}
              />
            )}
          </Pressable>
        ) : null}
      </View>

      {erro ? (
        <Text style={styles.erro} maxFontSizeMultiplier={1.15}>
          {erro}
        </Text>
      ) : null}
    </View>
  );
}

const visibilityStyles = StyleSheet.create({
  botao: {
    width: 44,
    height: 44,
    marginLeft: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});