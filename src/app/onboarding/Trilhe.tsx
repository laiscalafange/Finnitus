import { View, Text } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/TrilheStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";


export default function Trilhe() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <View style={styles.content}>
        <ProgressDots total={3} atual={2} />
       <View style={styles.linha}>
         <View>
            <Text style={styles.title2}>
              Trilhe
            </Text>
          <Underline width={100} marginLeft={30} />
          </View>
          <Text style={styles.title}>
              seu
            </Text>
      </View>
        <Text style={styles.title}>
         caminho
        </Text>
        <Text style={styles.title}>
          conosco
        </Text>
        <Text style={styles.subtitle}>
          Dê inicio a sua gestão financeira.
        </Text>
      </View>

       <View style={styles.conteiner}>
        <Button
                variante="primario"
                titulo="Continuar"
                onPress={() => roteador.push("/onboarding/Guiar")}
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