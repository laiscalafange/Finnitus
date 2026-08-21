import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
// deixei o mesmo por que o estilo é o mesmo da página de esqueci minha senha
import { styles } from "../../styles/FinancialDataStyles";
import { useState } from 'react';
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { JSX } from "react";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";


export default function DadosFinanceiros(): JSX.Element {
  const roteador = useRouter();

  const [economiaFutura, setEconomiaFutura] = useState(0);//ou "0"?
  const [tempo, setTempo] = useState(0);


  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.container}>
      <View style={styles.content}>
        <ProgressDots total={4} atual={2} />

        <Text style={styles.titulo}>
          <Text style={styles.tituloDestaque}>Economia</Text> futura
        </Text>

        <Text style={styles.subtitulo}>
          Vamos calcular quanto você precisa economizar para ter uma reserva financeira adequada.
        </Text>

        <Input
          label="Economia futura"
          placeholder="Quanto quer economizar?"
          icone={<Image
      source={require("../../../assets/icones/economia.png")}
      style={styles.iconeInput}
    />}
          value={economiaFutura.toString()}
  onChangeText={(text) => setEconomiaFutura(Number(text))}
  keyboardType="numeric"
        />

        <Input
          label="Tempo estimado"
          placeholder="Por quanto tempo deseja economizar?"
          icone={<Image
      source={require("../../../assets/icones/calendar.png")}
      style={styles.iconeInput}
    />}
          value={tempo.toString()}
          onChangeText={(text) => setTempo(Number(text))}
          keyboardType="numeric" // "calendar" ou "numeric"?
        />
      </View>

      <Button
        variante="primario"
        titulo="Confirmar"
        onPress={() => roteador.push("/configuracaoInicial/FutureGoals")} // navegação para terceira página do onboarding financeiro
      />
    </View>
    </View>
  );
}