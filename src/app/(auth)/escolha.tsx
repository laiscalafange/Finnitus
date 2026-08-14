import { View, Text, Image } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/escolhaStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";

export default function Escolha() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
      <View style={styles.linha}>
       <View>
        <Text style={styles.title2}>
        Escolha
        </Text>
        <Underline width={120} marginLeft={10} />
        </View>
      </View>
      <Text style={styles.title}>
        uma opção
      </Text>
       <Text style={styles.title}>
       para continuar
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
          onPress={() => roteador.push("/cadastro")}
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