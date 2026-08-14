import { View, Text, Image } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/voltandoStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";

export default function Voltando() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
        <Text style={styles.title}>
        Seja <Text style={styles.title2}>
        bem-
      </Text>
        </Text>
       <Text style={styles.title2}>
       vindo <Text style={styles.title}>
        de volta!
      </Text>
      </Text>
    </View>

      <View style={styles.content2}>
        <Text style={styles.subtitle}>
          Continue com o email ou outros serviços.
        </Text>
      </View>

       <View style={styles.conteiner}>
       <Button
          variante="primario"
          titulo="Email"
          onPress={() => roteador.push("/login")}
          icone={
          <Image
            source={require("../../../assets/icones/email2.png")}
            style={{
              width: 20,
              height: 20,
              marginRight: 8,
              resizeMode: "contain"
           }}
           />
          }
        />
        <Button
                variante="outline"
                titulo="Google"
                onPress={() => roteador.push("/login")}
               icone={
          <Image
            source={require("../../../assets/icones/google.png")}
            style={{
              width: 20,
              height: 20,
              marginRight: 8,
              resizeMode: "contain"
           }}
           />
          }
        />
              
        </View>
    </View>
  );
} 