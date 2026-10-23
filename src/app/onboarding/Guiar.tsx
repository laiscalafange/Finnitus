import { View, Text, ScrollView } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/GuiarStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";

// Limite do aumento de fonte do sistema (evita o texto estourar a tela)
const LIMITE_FONTE = 1.1;

export default function Guiar() {
  const roteador = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      {/* O texto rola se não couber; os botões ficam sempre livres embaixo */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProgressDots total={3} atual={3} />
        <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
          Ele vai te
        </Text>
        <View style={styles.linha}>
          <View>
            <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
              guiar
            </Text>
            <Underline width={80} marginLeft={26} />
          </View>
          <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
            pelo
          </Text>
        </View>
        <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
          app
        </Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Ajudando em funções e explicações.
        </Text>
      </ScrollView>

      <View style={styles.conteiner}>
        <Button
          variante="primario"
          titulo="Continuar"
          onPress={() => roteador.push("/onboarding/exPlano")}
        />
        <Button
          variante="outline"
          titulo="Pular"
          onPress={() => roteador.push("/onboarding/exPlano")}
        />
      </View>
    </View>
  );
}