import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/FutureVisionStyles";
import { Benefit } from "../../shared/components/Benefit/Benefit";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";

export default function FutureVision() {
  const roteador = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <View style={styles.container}>
        {/* O conteúdo rola se não couber; o botão fica sempre livre embaixo */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.content, { paddingBottom: 16 }]}
          showsVerticalScrollIndicator={false}
        >
          <ProgressDots total={4} atual={4} />

          <Text style={styles.titulo} maxFontSizeMultiplier={1.1}>
            <Text style={styles.tituloDestaque}>Visão</Text> de futuro
          </Text>

          <Text style={styles.subtitulo} maxFontSizeMultiplier={1.1}>
            Resultados futuros
          </Text>

          <View style={styles.cards}>
            <Benefit
              icon={require("../../../assets/icones/dinheiro.png")}
              title="Controle seus gastos"
              description="Registre despesas e entenda para onde seu dinheiro vai"
            />

            <Benefit
              icon={require("../../../assets/icones/decisoes.png")}
              title="Decisões financeiras melhores"
              description="Escolhas mais seguras para seu futuro"
            />

            <Benefit
              icon={require("../../../assets/icones/saco.png")}
              title="Crie o hábito de poupar"
              description="Dicas práticas para guardar dinheiro no dia a dia"
            />
          </View>
        </ScrollView>

        <Button
          titulo="Começar jornada"
          onPress={() => roteador.push("../paginaInicial")} // seria a home
        />
      </View>
    </View>
  );
}