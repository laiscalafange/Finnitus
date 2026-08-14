import { View, Text } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/TrilheStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";

export default function Trilhe() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <View style={styles.content}>
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
      </View>

      <View style={styles.content2}>
        <Text style={styles.subtitle}>
          Dê inicio a sua 
        </Text>
        <Text style={styles.subtitle}>
         gestão financeira.
        </Text>
      </View>

       <View style={styles.conteiner}>
        <Button
                variante="primario"
                titulo="Continuar"
                onPress={() => roteador.push("/onboarding/Conheca")}
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