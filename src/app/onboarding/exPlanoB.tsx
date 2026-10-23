import { View, Text, Image, ScrollView } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/exPlanoBStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";

// Limite do aumento de fonte do sistema (evita o texto estourar a tela)
const LIMITE_FONTE = 1.1;

export default function exPlanoB() {
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
        <ProgressDots total={5} atual={5} />
        <View style={styles.linha}>
          <View>
            <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
              Plano
            </Text>
            <Underline width={70} marginLeft={12} />
          </View>
          <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
            B
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Imprevistos acontecem.
        </Text>
        <View style={styles.linhaTexto}>
          <Image
            source={require("../../../assets/icones/sla.png")}
            style={styles.iconeInput}
          />
          <Text style={styles.stitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Reorganize o orçamento
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Ajuste gastos quando surgir uma despesa inesperada.
        </Text>
        <View style={styles.linhaTexto}>
          <Image
            source={require("../../../assets/icones/balanca.png")}
            style={styles.iconeInput}
          />
          <Text style={styles.stitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Mantenha o equilíbrio
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Encontre alternativas para não comprometer suas metas.
        </Text>
      </ScrollView>

      <View style={styles.conteiner}>
        <Button
          variante="primario"
          titulo="Entendi"
          onPress={() => roteador.push("../configuracaoInicial/FinancialData")}
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