import { View, Text, Image, ScrollView } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/exCalenStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";

// Limite do aumento de fonte do sistema (evita o texto estourar a tela)
const LIMITE_FONTE = 1.1;

export default function exCalendario() {
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
        <ProgressDots total={5} atual={4} />
        <View style={styles.linha}>
          <View>
            <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
              Calendário
            </Text>
            <Underline width={80} marginLeft={12} />
          </View>
        </View>
        <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
          Digital
        </Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Organize seus compromissos.
        </Text>
        <View style={styles.linhaTexto}>
          <Image
            source={require("../../../assets/icones/calendar2.png")}
            style={styles.iconeInput}
          />
          <Text style={styles.stitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Controle de datas
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Veja datas de vencimento de contas e compromissos importantes.
        </Text>
        <View style={styles.linhaTexto}>
          <Image
            source={require("../../../assets/icones/scortado.png")}
            style={styles.iconeInput}
          />
          <Text style={styles.stitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Evite atrasos
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Receba lembretes e não perca prazos.
        </Text>
      </ScrollView>

      <View style={styles.conteiner}>
        <Button
          variante="primario"
          titulo="Entendi"
          onPress={() => roteador.push("/onboarding/exPlanoB")}
        />
        <Button
          variante="outline"
          titulo="Voltar"
          onPress={() => roteador.push("/onboarding/exDashboard")}
        />
      </View>
    </View>
  );
}