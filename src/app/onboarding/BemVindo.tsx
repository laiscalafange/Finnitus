import { View, Text } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/bemVindoStyle";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";

export default function BemVindo() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <View style={styles.content}>
        <ProgressDots total={3} atual={1} />
        <Text style={styles.title}>
          Seja
        </Text>
        <Text style={styles.title2}>
          bem-vindo
        </Text>
        <Text style={styles.title}>
          ao Finnitus
        </Text>
        <Underline width={170} marginLeft={80} />
        
        <Text style={styles.subtitle}>
          Comece aqui a  {"\n"}sua jornada
        </Text>
        <Text style={styles.subtitle2}>
          financeira.
        </Text>
      </View>

       <View style={styles.conteiner}>
        <Button
                variante="primario"
                titulo="Continuar"
                onPress={() => roteador.push("/onboarding/Trilhe")}
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