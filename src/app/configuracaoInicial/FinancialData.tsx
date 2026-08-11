import { useState } from "react";
import { useRouter } from "expo-router";
import { Text, View, Image } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/forgotPasswordStyles";

export default function DadosFinanceiros() {
  const roteador = useRouter();

  const [salario, setSalario] = useState<string>("");
  const [despesas, setDespesas] = useState<string>("");

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.container}>
      <View style={styles.content}>
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
          icone={
            <Image
              source={require("../../../assets/icones/salario.png")}
              style={styles.iconeInput}
            />
          }
          value={salario}
          onChangeText={setSalario}
          keyboardType="numeric"
        />

        <Input
          label="Despesas"
          placeholder="Quais suas despesas mensais?"
          icone={
            <Image
              source={require("../../../assets/icones/despesas.png")}
              style={styles.iconeInput}
            />
          }
          value={despesas}
          onChangeText={setDespesas}
          keyboardType="numeric"
        />
      </View>

      {/* Fazer o cálculo da renda - despesas para auxiliar na gestão financeira */}

      <Button
        variante="primario"
        titulo="Confirmar"
        onPress={() =>
          roteador.push("/configuracaoInicial/FutureSavings")
        }
      />
    </View>
    </View>
  );
}