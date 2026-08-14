import { View, Text, Image } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/exDashStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";

export default function exDashboard() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
      <View style={styles.linha}>
        <View>
        <Text style={styles.title2}>
        Seu
        </Text>
        <Underline width={50} marginLeft={20} />
        </View>
       <Text style={styles.title}> 
       Dashboard
       </Text>
    </View>
    <Text style={styles.subtitle}>
         Veja seu dinheiro em tempo real
        </Text>
      </View>

      <View style={styles.content2}>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/olho.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
         Visão geral completa
        </Text>
        </View>
        <Text style={styles.subtitle2}>
         Acompanhe seus gastos, receitas e saldo em um só lugar.
        </Text>
      </View>

      <View style={styles.content3}>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/check.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
        Entenda seus hábitos
        </Text>
        </View>
        <Text style={styles.subtitle2}>
         Identifique onde você está gastando mais.
        </Text>
      </View>

       <View style={styles.conteiner}>
        <Button
                variante="primario"
                titulo="Entendi"
                onPress={() => roteador.push("/onboarding/exCalendario")}
              />
              <Button
                variante="outline"
                titulo="Voltar"
                onPress={() => roteador.push("/onboarding/exMetas")}
              />
        </View>
    </View>
  );
}