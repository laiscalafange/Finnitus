import { useRouter } from "expo-router";
import { Text, View } from "react-native";
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
        <View style={styles.content}>
          <ProgressDots total={4} atual={4} />

          <Text style={styles.titulo}>
            <Text style={styles.tituloDestaque}>Visão</Text> de futuro
          </Text>

          <Text style={styles.subtitulo}>Resultados futuros</Text>

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
        </View>

        <Button
          titulo="Começar jornada"
          onPress={() => roteador.push("/proximaTela")} // seria a home
        />
      </View>
    </View>
  );
}