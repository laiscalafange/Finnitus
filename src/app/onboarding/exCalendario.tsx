import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { styles } from "../../styles/exCalenStyles";

export default function exCalendario() {
const roteador = useRouter();

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
      <View style={styles.linha}>
        <View>
        <Text style={styles.title2}>
        Calendário
        </Text>
        <Underline width={100} marginLeft={15} />
        </View>
        </View>
       <Text style={styles.title}> 
       Digital
       </Text>
    
    <Text style={styles.subtitle}>
         Organize seus compromissos.
        </Text>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/calendar2.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
         Controle de datas
        </Text>
        </View>
        <Text style={styles.subtitle}>
         Veja datas de vencimento de contas e compromissos importantes.
        </Text>
        <View style={styles.linhaTexto}>
       <Image
       source={require("../../../assets/icones/scortado.png")}
       style={styles.iconeInput}
       />
        <Text style={styles.stitulo}>
        Evite atrasos
        </Text>
        </View>
        <Text style={styles.subtitle}>
         Receba lembretes e não perca prazos.
        </Text>
      </View>

       <View style={styles.conteiner}>
        <Button
                variante="primario"
                titulo="Entendi"
                onPress={() => roteador.push("/onboarding/exPlanoB")}
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