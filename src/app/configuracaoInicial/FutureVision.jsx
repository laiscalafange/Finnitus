import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
// deixei o mesmo por que o estilo é o mesmo da página de esqueci minha senha
import { styles } from "../../styles/forgotPasswordStyles";
import { useState } from 'react';



export default function FutureVision() {
  const roteador = useRouter();

  const [economiaFutura, setEconomiaFutura] = useState(0);//ou "0"?
  const [tempo, setTempo] = useState(0);


  return (
    <View style={styles.container}>
  

      <View style={styles.content}>
        <Text style={styles.titulo}>
          <Text style={styles.tituloDestaque}>Economia</Text> futura
        </Text>

        <Text style={styles.subtitulo}>
          Fundos de emergência são essenciais para lidar com imprevistos financeiros. Vamos calcular quanto você precisa economizar para ter uma reserva financeira adequada.
        </Text>

        <Input
          label="economia futura"
          placeholder="Quanto quer economizar?"
          icone={<Image
      source={require("../../../assets/icones/economia.png")}
      style={styles.iconeInput}
    />}
          value={economiaFutura}
          onChangeText={setEconomiaFutura}
          keyboardType="numeric"
        />

        <Input
          label="Tempo estimado"
          placeholder="Por quanto tempo deseja economizar?"
          icone={<Image
      source={require("../../../assets/icones/calendar.png")}
      style={styles.iconeInput}
    />}
          value={tempo}
          onChangeText={setTempo}
          keyboardType="numeric" // "calendar" ou "numeric"?
        />
      </View>

      <Button
        variante="primario"
        titulo="Confirmar"
        onPress={() => roteador.push("/configuracaoInicial/FutureVision")} // navegação para terceira página do onboarding financeiro
      />
    </View>
  );
}