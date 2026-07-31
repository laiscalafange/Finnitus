import { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { styles } from "./FourStyles";
import { FourProps } from "./FourTypes";

export function FourInput({
  tamanho = 4,
  onCodigoCompleto,
  erro,
}: FourProps) {
  const [digitos, setDigitos] = useState<string[]>(Array(tamanho).fill(""));
  const [focoAtual, setFocoAtual] = useState<number | null>(null);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  function handleChange(texto: string, index: number) {
    const valor = texto.replace(/[^0-9]/g, "").slice(-1);

    const novosDigitos = [...digitos];
    novosDigitos[index] = valor;
    setDigitos(novosDigitos);

    if (valor && index < tamanho - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const codigoCompleto = novosDigitos.join("");
    if (codigoCompleto.length === tamanho) {
      onCodigoCompleto(codigoCompleto);
    }
  }

  function handleKeyPress(e: any, index: number) {
    if (e.nativeEvent.key === "Backspace" && !digitos[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.linha}>
      {digitos.map((digito, index) => (
        <TextInput
          key={index}
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
          onChangeText={(texto) => handleChange(texto, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocoAtual(index)}
          onBlur={() => setFocoAtual(null)}
        />
      ))}
    </View>
  );
}