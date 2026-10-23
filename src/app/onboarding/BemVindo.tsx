import { View, Text, ScrollView } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/bemVindoStyle";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";

// Limite do aumento de fonte do sistema (evita o texto estourar a tela)
const LIMITE_FONTE = 1.1;

export default function BemVindo() {
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
        <ProgressDots total={3} atual={1} />
        <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
          Seja
        </Text>
        <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
          bem-vindo
        </Text>
        <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
          ao Finnitus
        </Text>
        <Underline width={150} marginLeft={70} />

        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Comece aqui a {"\n"}sua jornada
        </Text>
        <Text style={styles.subtitle2} maxFontSizeMultiplier={LIMITE_FONTE}>
          financeira.
        </Text>
      </ScrollView>

      <View style={styles.conteiner}>
        <Button
          variante="primario"
          titulo="Continuar"
          onPress={() => roteador.push("/onboarding/Trilhe")}
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