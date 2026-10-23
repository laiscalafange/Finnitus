import { View, Text, Image, ScrollView } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/exPlanoStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";

// Limite do aumento de fonte do sistema (evita o texto estourar a tela)
const LIMITE_FONTE = 1.1;

export default function exPlano() {
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
        <ProgressDots total={5} atual={1} />
        <View style={styles.linha}>
          <View>
            <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
              Plano
            </Text>
            <Underline width={70} marginLeft={12} />
          </View>
          <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
            do Mês
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Planeje seu mês.
        </Text>
        <View style={styles.linhaTexto}>
          <Image
            source={require("../../../assets/icones/salario2.png")}
            style={styles.iconeInput}
          />
          <Text style={styles.stitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Visão de gastos
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Registre o que pretende gastar e evite surpresas.
        </Text>
        <View style={styles.linhaTexto}>
          <Image
            source={require("../../../assets/icones/economia2.png")}
            style={styles.iconeInput}
          />
          <Text style={styles.stitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Defina um limite
          </Text>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Saiba quanto pode usar sem comprometer seu orçamento.
        </Text>
      </ScrollView>

      <View style={styles.conteiner}>
        <Button
          variante="primario"
          titulo="Entendi"
          onPress={() => roteador.push("/onboarding/exMetas")}
        />
      </View>
    </View>
  );
}