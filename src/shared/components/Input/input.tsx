import {
  View,
  Text,
  TextInput,
} from "react-native";

import { Cores } from "../../constants/Cores";
import { styles } from "./InputStyles";
import type { InputProps } from "./InputTypes";

export function Input({
  label,
  erro,
  icone,
  placeholder,
  secureTextEntry,
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
  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label}>
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
          accessibilityLabel={label}
          placeholder={placeholder}
          placeholderTextColor={Cores.texto.desabilitado}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          editable={editable}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </View>

      {erro ? (
        <Text style={styles.erro}>
          {erro}
        </Text>
      ) : null}
    </View>
  );
}