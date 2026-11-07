import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export function AceiteCadastroGoogle({ aceito, onChange }: { aceito: boolean; onChange: (v: boolean) => void }) {
  const router = useRouter();
  return (
    <View style={{ paddingVertical: 10, gap: 10 }}>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: aceito }}
        onPress={() => onChange(!aceito)} style={{ padding: 8 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
          {aceito ? '☑' : '☐'} Para criar conta pelo Google: confirmo ter 18 anos ou mais e ter lido os documentos legais.
        </Text>
      </Pressable>
      <Pressable accessibilityRole="link" onPress={() => router.push('/legal/termos-de-uso' as never)}>
        <Text style={{ color: '#FFF081', textDecorationLine: 'underline' }}>Termos de Uso</Text>
      </Pressable>
      <Pressable accessibilityRole="link" onPress={() => router.push('/legal/politica-de-privacidade' as never)}>
        <Text style={{ color: '#FFF081', textDecorationLine: 'underline' }}>Política de Privacidade</Text>
      </Pressable>
    </View>
  );
}
