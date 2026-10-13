import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";

import { HeaderInterno } from "../../shared/components/Header";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { styles as form } from "@/features/menuMais/styles/formulario";
import { useVoltar } from "@/features/menuMais/useVoltar";
import {
  dataValida,
  formatarMoeda,
  hojeFormatado,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "@/features/menuMais/utils";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  competenciaAtual,
  contaDoMes,
  diasAte,
  estaAberta,
  nomeCompetencia,
} from "@/features/contas/contasData";
import { styles } from "@/features/contas/styles";

// Tela "Confirmar pagamento / recebimento". A pessoa revisa a data e o valor
// que realmente aconteceram e só então o app registra. Nunca é automático.
// Recebe ?id=...&competencia=AAAA-MM.
export default function ConfirmarConta() {
  const voltar = useVoltar();
  const { id, competencia: competenciaParam } = useLocalSearchParams<{
    id?: string;
    competencia?: string;
  }>();

  const { transacoes, baixas, registrarBaixa } = useFinanceiro();

  const transacao = transacoes.find((item) => item.id === id);
  const competencia = competenciaParam ?? competenciaAtual();
  const conta = transacao ? contaDoMes(transacao, baixas, competencia) : undefined;

  // Já vem com a data de hoje e o valor previsto, pra revisar
  const [data, setData] = useState(hojeFormatado());
  const [valor, setValor] = useState(
    conta ? mascararMoeda(String(Math.round(conta.valorPrevisto * 100))) : "",
  );
  const [erro, setErro] = useState("");

  // Conta que não existe, não é fixa ou já foi registrada neste mês
  if (!conta || !conta.recorrente || !estaAberta(conta)) {
    return (
      <LinearGradient
        colors={["#160B24", "#08070A", "#160B24"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={form.container}
      >
        <HeaderInterno titulo="Confirmar" subtitulo="Pagamento" mostrarPremium={false} mostrarNotificacao={false} />
        <View style={form.formulario}>
          <Text style={styles.vazio}>
            Essa conta não está mais aguardando confirmação neste mês.
          </Text>
          <Button titulo="Voltar" variante="outline" onPress={voltar} />
        </View>
      </LinearGradient>
    );
  }

  const entrada = conta.tipo === "entrada";
  const palavra = entrada ? "recebimento" : "pagamento";
  const valorNumero = moedaParaNumero(valor);
  const diferenca = Math.round((valorNumero - conta.valorPrevisto) * 100) / 100;

  function confirmar() {
    if (valorNumero <= 0) {
      setErro(`Informe o valor ${entrada ? "recebido" : "pago"}.`);
      return;
    }

    if (!dataValida(data)) {
      setErro("Informe uma data válida (DD/MM/AAAA).");
      return;
    }

    // Não dá pra confirmar algo que ainda não aconteceu
    if (diasAte(data) > 0) {
      setErro(
        `A data não pode ser futura. Confirme só depois de ${entrada ? "receber" : "pagar"}.`,
      );
      return;
    }

    const resultado = registrarBaixa({
      transacaoId: conta!.transacaoId,
      competencia: conta!.competencia,
      dataRealizada: data,
      valorRealizado: valorNumero,
    });

    if (resultado !== "ok") {
      setErro("Esse mês já foi registrado ou a conta não existe mais.");
      return;
    }

    voltar();
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={form.container}
    >
      <KeyboardAvoidingView
        style={form.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={form.conteudo}
        >
          <HeaderInterno
            titulo={entrada ? "Confirmar recebimento" : "Confirmar pagamento"}
            subtitulo={nomeCompetencia(conta.competencia)}
            mostrarPremium={false}
            mostrarNotificacao={false}
          />

          <View style={form.formulario}>
            <Text style={styles.pergunta}>
              Você está confirmando que o {palavra} de{" "}
              <Text style={styles.perguntaDestaque}>{conta.nome}</Text> no valor previsto de{" "}
              <Text style={styles.perguntaDestaque}>{formatarMoeda(conta.valorPrevisto)}</Text> foi
              realizado?
            </Text>

            <Input
              label={entrada ? "Data do recebimento" : "Data do pagamento"}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              value={data}
              onChangeText={(texto) => setData(mascararData(texto))}
            />

            <Input
              label={entrada ? "Valor recebido" : "Valor pago"}
              placeholder="0,00"
              keyboardType="numeric"
              value={valor}
              onChangeText={(texto) => setValor(mascararMoeda(texto))}
              icone={<Text style={form.prefixoMoeda}>R$</Text>}
            />

            {/* O previsto fica guardado separado do valor realizado */}
            {valorNumero > 0 && diferenca !== 0 ? (
              <Text style={styles.aviso}>
                {entrada && diferenca < 0
                  ? "Será registrado como recebimento parcial. "
                  : ""}
                Diferença de {formatarMoeda(Math.abs(diferenca))} {diferenca > 0 ? "a mais" : "a menos"}{" "}
                que o previsto. O valor previsto ({formatarMoeda(conta.valorPrevisto)}) continua
                guardado no histórico.
              </Text>
            ) : null}

            {erro ? (
              <Text style={form.erro} accessibilityRole="alert">
                {erro}
              </Text>
            ) : null}

            <Button
              titulo={entrada ? "Confirmar recebimento" : "Confirmar pagamento"}
              onPress={confirmar}
            />
            <View style={styles.espaco} />
            <Button titulo="Cancelar" variante="outline" onPress={voltar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}