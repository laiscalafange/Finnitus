import { View, Text, Image } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/exDashStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";


export default function exDashboard() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
      <ProgressDots total={5} atual={3} />
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
         Veja seu dinheiro em tempo real.
        </Text>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/olho.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
         Visão geral completa
        </Text>
        </View>
        <Text style={styles.subtitle}>
         Acompanhe seus gastos, receitas e saldo em um só lugar.
        </Text>

        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/check.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
        Entenda seus hábitos
        </Text>
        </View>
        <Text style={styles.subtitle}>
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