import type { ReactNode } from "react";

import type {
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";

export interface InputProps {
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  autoComplete?: TextInputProps["autoComplete"];
  editable?: boolean;
  maxLength?: number;

  // Campo de texto grande (várias linhas), usado em mensagens
  multiline?: boolean;
  numberOfLines?: number;

  label?: string;
  erro?: string;
  icone?: ReactNode;
  placeholder?: string;

  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;

  value?: string;
  onChangeText?: (text: string) => void;
}