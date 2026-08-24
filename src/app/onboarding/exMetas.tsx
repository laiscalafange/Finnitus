import { View, Text, Image } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/exMetasStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";


export default function exMetas() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
      <ProgressDots total={5} atual={2} />
      <View style={styles.linha}>
        <View>
        <Text style={styles.title2}>
        Metas
        </Text>
        <Underline width={85} marginLeft={15} />
        </View>
       <Text style={styles.title}> 
       pessoais
       </Text>
    </View>
    <Text style={styles.subtitle}>
         Construa seus objetivos.
        </Text>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/estrela.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
         Defina Metas
        </Text>
        </View>
        <Text style={styles.subtitle}>
         Crie objetivos como viagens e reservas de emergência.
        </Text>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/grafico.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
        Veja seu progresso
        </Text>
        </View>
        <Text style={styles.subtitle}>
         O quanto você já economizou e quanto ainda falta.
        </Text>
      </View>

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