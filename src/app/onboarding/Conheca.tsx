import { View, Text } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/ConhecaStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";

export default function Conheca() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <View style={styles.content}>
        <Text style={styles.title}>
         Conheça o
        </Text>
        <Text style={styles.title2}>
          Finn!
        </Text>
        <Underline width={85} />
      </View>

      <View style={styles.content2}>
        <Text style={styles.subtitle}>
         Seu novo
        </Text>
        <Text style={styles.subtitle2}>
         ajudante
        </Text>
        <Text style={styles.subtitle}>
          financeiro digital.
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
                onPress={() => roteador.push("/login")}
              />
        </View>
    </View>
  );
}