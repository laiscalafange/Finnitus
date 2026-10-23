import { View, Text, Image, ScrollView } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/exDashStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";

// Limite do aumento de fonte do sistema (evita o texto estourar a tela)
const LIMITE_FONTE = 1.1;

export default function exDashboard() {
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
        <ProgressDots total={5} atual={3} />
        <View style={styles.linha}>
          <View>
            <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
              Seu
            </Text>
            <Underline width={40} marginLeft={16} />
          </View>
          <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
            Dashboard
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Veja seu dinheiro em tempo real.
        </Text>
        <View style={styles.linhaTexto}>
          <Image
            source={require("../../../assets/icones/olho.png")}
            style={styles.iconeInput}
          />
          <Text style={styles.stitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Visão geral completa
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Acompanhe seus gastos, receitas e saldo em um só lugar.
        </Text>
        <View style={styles.linhaTexto}>
          <Image
            source={require("../../../assets/icones/check.png")}
            style={styles.iconeInput}
          />
          <Text style={styles.stitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Entenda seus hábitos
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Identifique onde você está gastando mais.
        </Text>
      </ScrollView>

      <View style={styles.conteiner}>
        <Button
          variante="primario"
          titulo="Entendi"
          onPress={() => roteador.push("/onboarding/exCalendario")}
        />
        <Button
          variante="outline"
          titulo="Voltar"
          onPress={() => roteador.push("/onboarding/exMetas")}
        />
      </View>
    </View>
  );
}