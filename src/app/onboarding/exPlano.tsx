import { View, Text, Image } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/exPlanoStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";


export default function exPlano() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
      <ProgressDots total={5} atual={1} />
      <View style={styles.linha}>
        <View>
        <Text style={styles.title2}>
        Plano
        </Text>
        <Underline width={85} marginLeft={15} />
        </View>
       <Text style={styles.title}> 
       do Mês
       </Text>
    </View>
    <Text style={styles.subtitle}>
         Planeje seu mês.
        </Text>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/salario2.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
         Visão de gastos
        </Text>
        </View>
        <Text style={styles.subtitle}>
         Registre o que pretende gastar e evite surpresas.
        </Text>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/economia2.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
         Defina um limite
        </Text>
        </View>
        <Text style={styles.subtitle}>
         Saiba quanto pode usar sem comprometer seu orçamento.
        </Text>
      </View>

       <View style={styles.conteiner}>
        <Button
                variante="primario"
                titulo="Entendi"
                onPress={() => roteador.push("/onboarding/exMetas")}
              />
        </View>
    </View>
  );
}