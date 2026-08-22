import { useState } from "react";
import { useRouter } from "expo-router";
import { Text, View, Image } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/FinancialDataStyles";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";
import { useFinanceiro } from "../../features/financeiroContext";

function parseNumero(texto: string) {
  const valor = Number(texto.replace(/[^0-9,.-]/g, "").replace(",", "."));
  return Number.isFinite(valor) ? valor : undefined;
}

export default function DadosFinanceiros() {
  const roteador = useRouter();
  const { salario: salarioSalvo, despesas: despesasSalvas, setSalario, setDespesas } = useFinanceiro();
  const [salario, setSalarioLocal] = useState<string>(salarioSalvo?.toString() ?? "");
  const [despesas, setDespesasLocal] = useState<string>(despesasSalvas?.toString() ?? "");

  function confirmar() {
    setSalario(parseNumero(salario));
    setDespesas(parseNumero(despesas));
    roteador.push("/configuracaoInicial/FutureSavings");
  }

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />
      <View style={styles.container}>
        <View style={styles.content}>
          <ProgressDots total={4} atual={1} />
          <Text style={styles.titulo}>
            <Text style={styles.tituloDestaque}>Dados</Text> financeiros
          </Text>
          <Text style={styles.subtitulo}>
            Preencha seus dados financeiros para que possamos te ajudar a controlar
            melhor suas finanças.
          </Text>
          <Input
            label="Salário"
            placeholder="Qual sua renda mensal?"
            icone={<Image source={require("../../../assets/icones/salario.png")} style={styles.iconeInput} />}
            value={salario}
            onChangeText={setSalarioLocal}
            keyboardType="numeric"
          />
          <Input
            label="Despesas"
            placeholder="Quais suas despesas mensais?"
            icone={<Image source={require("../../../assets/icones/despesas.png")} style={styles.iconeInput} />}
            value={despesas}
            onChangeText={setDespesasLocal}
            keyboardType="numeric"
          />
        </View>
        <Button variante="primario" titulo="Confirmar" onPress={confirmar} />
      </View>
    </View>
  );
}
