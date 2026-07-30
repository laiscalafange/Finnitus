import { ReactNode } from "react";
import { KeyboardTypeOptions } from "react-native";

export interface InputProps {
  label?: string;
  erro?: string;
  icone?: ReactNode;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  value?: string;
  onChangeText?: (text: string) => void;
}