import { useRouter } from "expo-router";
import { Text, View, Image, ScrollView } from "react-native";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/FinancialDataStyles";
import { useState } from "react";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";
import { useFinanceiro } from "../../features/financeiroContext";
import {
  dataEhPassada,
  dataValida,
  formatarCentavos,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "../../features/menuMais/utils";

// Limite do aumento de fonte do sistema (evita o texto passar do campo)
const LIMITE_FONTE = 1.1;

// O app calcula a meta por mês, então a data limite vira "quantos meses faltam"
// (mínimo 1 mês).
function mesesAteData(data: string): number {
  const [dia, mes, ano] = data.split("/").map(Number);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dias = (new Date(ano, mes - 1, dia).getTime() - hoje.getTime()) / 86400000;

  return Math.max(1, Math.ceil(dias / 30.4375));
}

// Meses salvos -> data limite para mostrar no campo (hoje + N meses)
function dataEmMeses(meses?: number): string {
  if (!meses) {
    return "";
  }

  const data = new Date();
  data.setMonth(data.getMonth() + meses);

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");

  return `${dia}/${mes}/${data.getFullYear()}`;
}

export default function DadosFinanceiros() {
  const roteador = useRouter();
  const { economiaFutura: economiaSalva, tempoEconomia: tempoSalvo, setEconomiaFutura, setTempoEconomia } = useFinanceiro();
  const [economiaFutura, setEconomiaFuturaLocal] = useState(
    economiaSalva === undefined ? "" : formatarCentavos(Math.round(economiaSalva * 100))
  );
  const [dataLimite, setDataLimite] = useState(dataEmMeses(tempoSalvo));
  const [erroData, setErroData] = useState<string | undefined>();

  function confirmar() {
    // A data é opcional, mas se for preenchida precisa ser válida e futura
    if (dataLimite.trim() && (!dataValida(dataLimite) || dataEhPassada(dataLimite))) {
      setErroData("Informe uma data válida, a partir de hoje.");
      return;
    }

    setEconomiaFutura(economiaFutura.trim() ? moedaParaNumero(economiaFutura) : undefined);
    setTempoEconomia(dataLimite.trim() ? mesesAteData(dataLimite) : undefined);
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
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ProgressDots total={4} atual={2} />
          <Text style={styles.titulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            <Text style={styles.tituloDestaque}>Reserva</Text> de emergência
          </Text>
          <Text style={styles.subtitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            Vamos calcular quanto você precisa economizar para ter uma reserva financeira adequada.
          </Text>
          <Input
            label="Reserva de emergência"
            placeholder="0,00"
            icone={<Image source={require("../../../assets/icones/economia.png")} style={styles.iconeInput} />}
            value={economiaFutura}
            onChangeText={(texto) => setEconomiaFuturaLocal(mascararMoeda(texto))}
            keyboardType="numeric"
          />
          <Input
            label="Data limite"
            placeholder="DD/MM/AAAA"
            icone={<Image source={require("../../../assets/icones/calendar.png")} style={styles.iconeInput} />}
            value={dataLimite}
            onChangeText={(texto) => {
              setDataLimite(mascararData(texto));
              setErroData(undefined);
            }}
            keyboardType="numeric"
            maxLength={10}
            erro={erroData}
          />
        </ScrollView>
        <Button variante="primario" titulo="Confirmar" onPress={confirmar} />
        <Button variante="botaotexto" titulo="Deixar para depois" onPress={deixarParaDepois} />
      </View>
    </View>
  );
}