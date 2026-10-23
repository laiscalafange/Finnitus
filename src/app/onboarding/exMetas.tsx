import { View, Text, Image, ScrollView } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/exMetasStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";

// Limite do aumento de fonte do sistema (evita o texto estourar a tela)
const LIMITE_FONTE = 1.1;

export default function exMetas() {
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
        <ProgressDots total={5} atual={2} />
        <View style={styles.linha}>
          <View>
            <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
              Metas
            </Text>
            <Underline width={70} marginLeft={12} />
          </View>
          <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
            pessoais
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Construa seus objetivos.
        </Text>
        <View style={styles.linhaTexto}>
          <Image
            source={require("../../../assets/icones/estrela.png")}
            style={styles.iconeInput}
          />
          <Text style={styles.stitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Defina Metas
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Crie objetivos como viagens e reservas de emergência.
        </Text>
        <View style={styles.linhaTexto}>
          <Image
            source={require("../../../assets/icones/grafico.png")}
            style={styles.iconeInput}
          />
          <Text style={styles.stitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Veja seu progresso
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          O quanto você já economizou e quanto ainda falta.
        </Text>
      </ScrollView>

      <View style={styles.conteiner}>
        <Button
          variante="primario"
          titulo="Entendi"
          onPress={() => roteador.push("/onboarding/exDashboard")}
        />
        <Button
          variante="outline"
          titulo="Voltar"
          onPress={() => roteador.push("/onboarding/exPlano")}
        />
      </View>
    </View>
  );
}