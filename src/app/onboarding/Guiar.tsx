import { View, Text, useWindowDimensions } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/GuiarStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";

export default function Guiar() {
const roteador = useRouter();
const { height } = useWindowDimensions();

  const topContent = height * 0.100;
  const topContent2 = height * 0.35;

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={[
              styles.content,
              {
                top: topContent,
              },
            ]}
          >
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
      </View>

      <View style={[
                styles.content2,
                {
                  top: topContent2,
                },
              ]}
            >
        <Text style={styles.subtitle}>
         Ajudando em 
        </Text>
        <Text style={styles.subtitle}>
         funções e 
        </Text>
        <Text style={styles.subtitle}>
          explicações.
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