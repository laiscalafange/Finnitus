import { View, Text } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/bemVindoStyle";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";

export default function Trilhe() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <View style={styles.content}>
        <Text style={styles.title2}>
          Trilhe{" "} 
          <Text style={styles.title}>
          seu
          </Text>
        </Text>
        <Text style={styles.title}>
         caminho
        </Text>
        <Text style={styles.title}>
          conosco
        </Text>

        <Text style={styles.subtitle}>
          Dê inicio a sua
        </Text>
        <Text style={styles.subtitle}>
         gestão
        </Text>
        <Text style={styles.subtitle}>
          financeira
        </Text>
      </View>

       <View style={styles.conteiner}>
        <Button
                variante="primario"
                titulo="Continuar"
                onPress={() => roteador.push("/")}
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