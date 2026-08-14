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
        <View style={styles.linha}>
        <Text style={styles.title2}>
          Finn!
        </Text>
        <Underline width={100} marginLeft={-120} />
        </View>
      </View>

      <View style={styles.content2}>
        <Text style={styles.subtitle}>
         Seu novo <Text style={styles.subtitle2}>
         ajudante
        </Text>
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