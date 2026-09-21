import {
  useRef,
  useState,
} from "react";

import {
  TextInput,
  View,
} from "react-native";

import { styles } from "./FourStyles";
import type { FourProps } from "./FourTypes";

export function FourInput({
  tamanho = 4,
  onCodigoCompleto,
  erro,
}: FourProps) {
  const [digitos, setDigitos] = useState<string[]>(
    Array(tamanho).fill("")
  );

  const [focoAtual, setFocoAtual] = useState<
    number | null
  >(null);

  const inputsRef = useRef<
    Array<TextInput | null>
  >([]);

  function handleChange(
    texto: string,
    index: number
  ) {
    const valor = texto
      .replace(/[^0-9]/g, "")
      .slice(-1);

    const novosDigitos = [...digitos];
    novosDigitos[index] = valor;

    setDigitos(novosDigitos);

    if (valor && index < tamanho - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const codigoCompleto = novosDigitos.join("");

    // Também notifica quando um dígito é apagado.
    onCodigoCompleto(codigoCompleto);
  }

  function handleKeyPress(
    event: { nativeEvent: { key: string } },
    index: number
  ) {
    if (
      event.nativeEvent.key === "Backspace" &&
      !digitos[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.linha}>
      {digitos.map((digito, index) => (
        <TextInput
          key={index}
          accessibilityLabel={
            `Dígito ${index + 1} do código`
          }
          ref={(ref) => {
            inputsRef.current[index] = ref;
          }}
          style={[
            styles.caixa,
            focoAtual === index && styles.caixaFocada,
            erro && styles.caixaErro,
          ]}
          keyboardType="number-pad"
          maxLength={1}
          value={digito}
          onChangeText={(texto) => {
            handleChange(texto, index);
          }}
          onKeyPress={(event) => {
            handleKeyPress(event, index);
          }}
          onFocus={() => {
            setFocoAtual(index);
          }}
          onBlur={() => {
            setFocoAtual(null);
          }}
        />
      ))}
    </View>
  );
}