import { createContext, forwardRef, useContext, type ComponentProps, type ComponentRef } from "react";
import {
  StyleSheet,
  Text as TextoNativo,
  TextInput as EntradaNativa,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { useConfiguracoes } from "@/features/configuracoesContext";

const TextoAninhado = createContext(false);

function useEstiloTexto(style: StyleProp<TextStyle>, herdar = false): StyleProp<TextStyle> {
  const { configuracoes } = useConfiguracoes();
  const fator = configuracoes?.tamanhoTexto === "PEQUENO" ? 0.9
    : configuracoes?.tamanhoTexto === "GRANDE" ? 1.15
    : 1;
  if (fator === 1) return style;

  const base = StyleSheet.flatten(style);
  const fontSize = base?.fontSize ?? (herdar ? undefined : 14);
  return [style, {
    ...(fontSize === undefined ? {} : { fontSize: fontSize * fator }),
    ...(base?.lineHeight === undefined ? {} : { lineHeight: base.lineHeight * fator }),
  }];
}

export const Text = forwardRef<ComponentRef<typeof TextoNativo>, ComponentProps<typeof TextoNativo>>(
  function Text({ children, style, ...props }, ref) {
    const aninhado = useContext(TextoAninhado);
    const estilo = useEstiloTexto(style, aninhado);
    return (
      <TextoNativo {...props} ref={ref} style={estilo}>
        <TextoAninhado.Provider value>{children}</TextoAninhado.Provider>
      </TextoNativo>
    );
  },
);

export type TextInput = ComponentRef<typeof EntradaNativa>;
export const TextInput = forwardRef<TextInput, ComponentProps<typeof EntradaNativa>>(
  function TextInput({ style, ...props }, ref) {
    const estilo = useEstiloTexto(style);
    return <EntradaNativa {...props} ref={ref} style={estilo} />;
  },
);
