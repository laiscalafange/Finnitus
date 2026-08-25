import { View, Text, Image } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/exPlanoBStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";


export default function exPlanoB() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
       <ProgressDots total={5} atual={5} />
      <View style={styles.linha}>
        <View>
        <Text style={styles.title2}>
        Plano
        </Text>
        <Underline width={85} marginLeft={15} />
        </View>
        <Text style={styles.title}> 
       B
       </Text>
        </View>
       
    
    <Text style={styles.subtitle}>
         Imprevistos acontecem.
        </Text>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/sla.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
         Reorganize o orçamento
        </Text>
        </View>
        <Text style={styles.subtitle}>
         Ajuste gastos quando surgir uma despesa inesperada.
        </Text>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/balanca.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
        Mantenha o equilíbrio
        </Text>
        </View>
        <Text style={styles.subtitle}>
         Encontre alternativas para não comprometer suas metas.
        </Text>
      </View>

       <View style={styles.conteiner}>
        <Button
                variante="primario"
                titulo="Entendi"
                onPress={() => roteador.push("../configuracaoInicial/FinancialData")}
              />
              <Button
                variante="outline"
                titulo="Voltar"
                onPress={() => roteador.push("/onboarding/exDashboard")}
              />
        </View>
    </View>
  );
}