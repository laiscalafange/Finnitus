import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
// deixei o mesmo por que o estilo é o mesmo da página de esqueci minha senha
import { styles } from "../../styles/forgotPasswordStyles";
import { useState } from 'react';



export default function DadosFinanceiros() {
  const roteador = useRouter();

  const [salario, setSalario] = useState(0);//ou "0"?
  const [despesas, setDespesas] = useState(0);


  return (
    <View style={styles.container}>
  

      <View style={styles.content}>
        <Text style={styles.titulo}>
          <Text style={styles.tituloDestaque}>Dados</Text> financeiros
        </Text>

        <Text style={styles.subtitulo}>
          Preencha seus dados financeiros para que possamos te ajudar a controlar melhor suas finanças
        </Text>

        <Input
          label="Salário"
          placeholder="Qual sua renda mensal?"
          icone={<Image
      source={require("../../../assets/icones/salario.png")}
      style={styles.iconeInput}
    />}
          value={salario}
          onChangeText={setSalario}
          keyboardType="numeric"
        />

        <Input
          label="Despesas"
          placeholder="Quais suas despesas mensais?"
          icone={<Image
      source={require("../../../assets/icones/despesas.png")}
      style={styles.iconeInput}
    />}
          value={despesas}
          onChangeText={setDespesas}
          keyboardType="numeric"
        />
      </View>
      {/* fazer conta de quanto recebe e quanto gasta, oq sobra para fazer a gestão financeira */}

      <Button
        variante="primario"
        titulo="Confirmar"
        onPress={() => roteador.push("/configuracaoInicial/FutureSavings")} // navegação para segunda página do onboarding financeiro
      />
    </View>
  );
}