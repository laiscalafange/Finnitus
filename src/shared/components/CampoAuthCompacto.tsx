import { useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = Pick<
  TextInputProps,
  | "placeholder"
  | "value"
  | "onChangeText"
  | "keyboardType"
  | "autoComplete"
  | "autoCapitalize"
  | "maxLength"
  | "editable"
  | "secureTextEntry"
> & {
  label: string;
  icone: ImageSourcePropType;
};

export function CampoAuthCompacto({
  label,
  icone,
  secureTextEntry = false,
  editable = true,
  autoCapitalize,
  ...props
}: Props) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [focado, setFocado] = useState(false);

  return (
    <View style={{ gap: 5 }}>
      <Text
        style={{
          color: "#DAC7EC",
          fontWeight: "600",
          fontSize: 14,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          minHeight: 50,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: focado ? "#AA72FF" : "#60358B",
          backgroundColor: "rgba(42, 20, 59, 0.70)",
          paddingHorizontal: 13,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          accessible={false}
          source={icone}
          style={{
            width: 20,
            height: 20,
            resizeMode: "contain",
            tintColor: "#AD84EA",
          }}
        />

        <TextInput
          {...props}
          editable={editable}
          autoCapitalize={autoCapitalize ?? "none"}
          secureTextEntry={secureTextEntry && !mostrarSenha}
          placeholderTextColor="#A999BC"
          selectionColor="#B1FF00"
          autoCorrect={false}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          style={{
            flex: 1,
            minWidth: 0,
            height: 48,
            marginLeft: 11,
            color: "#FFFFFF",
            fontSize: 14,
            paddingVertical: 0,
          }}
        />

        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            disabled={!editable}
            onPress={() => setMostrarSenha((atual) => !atual)}
            hitSlop={8}
            style={{ padding: 5 }}
          >
            <Feather
              name={mostrarSenha ? "eye-off" : "eye"}
              size={21}
              color="#AD84EA"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
