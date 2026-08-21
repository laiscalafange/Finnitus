import { View, Text } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/GuiarStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";

export default function Guiar() {
const roteador = useRouter();
return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
        <Text style={styles.title}> 
        Ele vai te
       </Text>
      <View style={styles.linha}>
        <View>
        <Text style={styles.title2}>
        guiar
        </Text>
        <Underline width={90} marginLeft={30} />
        </View>
       <Text style={styles.title}> 
        pelo
       </Text>
    </View>

<Text style={styles.title}>app</Text>
        <Text style={styles.subtitle}>
         Ajudando em funções e explicações.
        </Text>
      </View>

       <View style={styles.conteiner}>
        <Button
                variante="primario"
                titulo="Continuar"
                onPress={() => roteador.push("/onboarding/exPlano")}
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