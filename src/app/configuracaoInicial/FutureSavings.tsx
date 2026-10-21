import { useRouter } from "expo-router";
import { Text, View, Image } from "react-native";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/FinancialDataStyles";
import { useState } from "react";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";
import { useFinanceiro } from "../../features/financeiroContext";

function parseNumero(texto: string) {
  const valor = Number(texto.replace(/[^0-9,.-]/g, "").replace(",", "."));
  return Number.isFinite(valor) ? valor : undefined;
}

export default function DadosFinanceiros() {
  const roteador = useRouter();
  const { economiaFutura: economiaSalva, tempoEconomia: tempoSalvo, setEconomiaFutura, setTempoEconomia } = useFinanceiro();
  const [economiaFutura, setEconomiaFuturaLocal] = useState(economiaSalva?.toString() ?? "");
  const [tempo, setTempoLocal] = useState(tempoSalvo?.toString() ?? "");

  function confirmar() {
    setEconomiaFutura(parseNumero(economiaFutura));
    setTempoEconomia(parseNumero(tempo));
    roteador.push("/configuracaoInicial/FutureGoals");
  }

  // "Deixar para depois": segue o fluxo sem preencher nem alterar nada
  function deixarParaDepois() {
    roteador.push("/configuracaoInicial/FutureGoals");
  }

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />
      <View style={styles.container}>
        <View style={styles.content}>
          <ProgressDots total={4} atual={2} />
          <Text style={styles.titulo}>
            <Text style={styles.tituloDestaque}>Reserva</Text> de emergência
          </Text>
          <Text style={styles.subtitulo}>
            Vamos calcular quanto você precisa economizar para ter uma reserva financeira adequada.
          </Text>
          <Input
            label="Reserva de emergência"
            placeholder="Quanto quer guardar na reserva?"
            icone={<Image source={require("../../../assets/icones/economia.png")} style={styles.iconeInput} />}
            value={economiaFutura}
            onChangeText={setEconomiaFuturaLocal}
            keyboardType="numeric"
          />
          <Input
            label="Tempo estimado"
            placeholder="Por quanto tempo deseja economizar?"
            icone={<Image source={require("../../../assets/icones/calendar.png")} style={styles.iconeInput} />}
            value={tempo}
            onChangeText={setTempoLocal}
            keyboardType="numeric"
          />
        </View>
        <Button variante="primario" titulo="Confirmar" onPress={confirmar} />
        <Button variante="botaotexto" titulo="Deixar para depois" onPress={deixarParaDepois} />
      </View>
    </View>
  );
}