import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  aceito: boolean;
  onChange: (valor: boolean) => void;
  disabled?: boolean;
};

export function AceiteCadastroGoogle({
  aceito,
  onChange,
  disabled = false,
}: Props) {
  const router = useRouter();

  return (
    // Mesma aparência e fontes da versão ORIGINAL.
    // Apenas os espaços verticais foram reduzidos.
    <View style={{ paddingVertical: 0, gap: 3 }}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: aceito, disabled }}
        disabled={disabled}
        onPress={() => onChange(!aceito)}
        hitSlop={6}
        style={{ paddingVertical: 3, paddingHorizontal: 0 }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
          {aceito ? "☑" : "☐"} Confirmo ter 18 anos ou mais e ter lido os documentos legais.
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="link"
        hitSlop={6}
        onPress={() => router.push("/legal/termos-de-uso" as never)}
        style={{ paddingVertical: 2 }}
      >
        <Text style={{ color: "#FFF081", textDecorationLine: "underline" }}>
          Termos de Uso
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="link"
        hitSlop={6}
        onPress={() => router.push("/legal/politica-de-privacidade" as never)}
        style={{ paddingVertical: 2 }}
      >
        <Text style={{ color: "#FFF081", textDecorationLine: "underline" }}>
          Política de Privacidade
        </Text>
      </Pressable>
    </View>
  );
}
