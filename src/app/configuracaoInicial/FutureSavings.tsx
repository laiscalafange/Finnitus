
import { useRouter } from "expo-router";
import {
  Text,
  View,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";

import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/FinancialDataStyles";
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

import { perfilFinanceiroService } from "../../services/perfilFinanceiro";

// Limita o aumento de fonte do sistema.
const LIMITE_FONTE = 1.1;

// Converte a data limite em quantidade de meses.
function mesesAteData(data: string): number {
  const [dia, mes, ano] = data.split("/").map(Number);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataFinal = new Date(ano, mes - 1, dia);
  dataFinal.setHours(0, 0, 0, 0);

  const dias =
    (dataFinal.getTime() - hoje.getTime()) / 86400000;

  return Math.max(1, Math.ceil(dias / 30.4375));
}

// Converte a quantidade de meses em uma data para exibição.
function dataEmMeses(meses?: number): string {
  if (!meses) {
    return "";
  }

  const data = new Date();
  const diaOriginal = data.getDate();

  data.setDate(1);
  data.setMonth(data.getMonth() + meses);

  const ultimoDia = new Date(
    data.getFullYear(),
    data.getMonth() + 1,
    0
  ).getDate();

  data.setDate(Math.min(diaOriginal, ultimoDia));

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");

  return `${dia}/${mes}/${data.getFullYear()}`;
}

export default function DadosFinanceiros() {
  const roteador = useRouter();

  const {
    economiaFutura: economiaSalva,
    tempoEconomia: tempoSalvo,
    setEconomiaFutura,
    setTempoEconomia,
  } = useFinanceiro();

  const [economiaFutura, setEconomiaFuturaLocal] = useState(
    economiaSalva === undefined
      ? ""
      : formatarCentavos(Math.round(economiaSalva * 100))
  );

  const [dataLimite, setDataLimite] = useState(
    dataEmMeses(tempoSalvo)
  );

  const [erroData, setErroData] = useState<string | undefined>();
  const [erroEconomia, setErroEconomia] = useState<string | undefined>();
  const [salvando, setSalvando] = useState(false);

  // Atualiza os campos quando os dados forem carregados no contexto.
  useEffect(() => {
    if (economiaSalva !== undefined) {
      setEconomiaFuturaLocal(
        formatarCentavos(Math.round(economiaSalva * 100))
      );
    }

    if (tempoSalvo !== undefined) {
      setDataLimite(dataEmMeses(tempoSalvo));
    }
  }, [economiaSalva, tempoSalvo]);

  async function confirmar() {
    if (salvando) return;

    let erroEncontrado = false;

    // Valida a data, caso tenha sido preenchida.
    if (
      dataLimite.trim() &&
      (!dataValida(dataLimite) || dataEhPassada(dataLimite))
    ) {
      setErroData("Informe uma data válida, a partir de hoje.");
      erroEncontrado = true;
    } else {
      setErroData(undefined);
    }

    // Valida o valor, caso tenha sido preenchido.
    const valorEconomia = economiaFutura.trim()
      ? moedaParaNumero(economiaFutura)
      : null;

    if (
      valorEconomia !== null &&
      (!Number.isFinite(valorEconomia) || valorEconomia <= 0)
    ) {
      setErroEconomia("Informe um valor maior que zero.");
      erroEncontrado = true;
    } else {
      setErroEconomia(undefined);
    }

    if (erroEncontrado) return;

    const prazoEmMeses = dataLimite.trim()
      ? mesesAteData(dataLimite)
      : null;

    setSalvando(true);

    try {
      // Envia os dados para o backend.
      // O backend identifica o usuário pelo token.
      await perfilFinanceiroService.salvarReserva({
        economia_futura: valorEconomia,
        tempo_economia: prazoEmMeses,
      });

      // Atualiza o contexto financeiro.
      setEconomiaFutura(valorEconomia ?? undefined);
      setTempoEconomia(prazoEmMeses ?? undefined);

      // Avança somente após a confirmação do backend.
      roteador.push("/configuracaoInicial/FutureGoals");
    } catch (erro) {
      console.error("Erro ao salvar reserva:", erro);

      Alert.alert(
        "Não foi possível salvar",
        "Verifique sua conexão e tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  }

  // Segue sem alterar os dados já salvos.
  function deixarParaDepois() {
    if (salvando) return;

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

          <Text
            style={styles.titulo}
            maxFontSizeMultiplier={LIMITE_FONTE}
          >
            <Text style={styles.tituloDestaque}>Reserva</Text> de emergência
          </Text>

          <Text
            style={styles.subtitulo}
            maxFontSizeMultiplier={LIMITE_FONTE}
          >
            Vamos calcular quanto você precisa economizar para ter uma
            reserva financeira adequada.
          </Text>

          <Input
            label="Reserva de emergência"
            placeholder="0,00"
            icone={
              <Image
                source={require("../../../assets/icones/economia.png")}
                style={styles.iconeInput}
              />
            }
            value={economiaFutura}
            onChangeText={(texto) => {
              setEconomiaFuturaLocal(mascararMoeda(texto));
              setErroEconomia(undefined);
            }}
            keyboardType="numeric"
            erro={erroEconomia}
          />

          <Input
            label="Data limite"
            placeholder="DD/MM/AAAA"
            icone={
              <Image
                source={require("../../../assets/icones/calendar.png")}
                style={styles.iconeInput}
              />
            }
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

        <Button
          variante="primario"
          titulo={salvando ? "Salvando..." : "Confirmar"}
          onPress={confirmar}
        />

        <Button
          variante="botaotexto"
          titulo="Deixar para depois"
          onPress={deixarParaDepois}
        />
      </View>
    </View>
  );
}
