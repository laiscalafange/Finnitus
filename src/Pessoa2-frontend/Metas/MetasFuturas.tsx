import { Image, StyleSheet, Text, View, } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { HeaderInterno } from "../../shared/components/Header";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";

import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";
import { GRADIENTS } from "../../shared/constants/Gradientes";

export default function MetasFuturas() {
  return (
    <LinearGradient
      colors={GRADIENTS.background.colors}
      start={GRADIENTS.background.start}
      end={GRADIENTS.background.end}
      style={styles.container}
    >

      {/* HEADER */}
      <HeaderInterno
        titulo="Metas"
        subtitulo="Criação"
      />

      {/* CONTEÚDO POR CIMA DO HEADER */}
      <View style={styles.conteudoSobreHeader}>

        {/* TÍTULO */}
        <Text style={styles.titulo}>
          Sonhos futuros
        </Text>

        {/* SALÁRIO */}
        <Input
          label="Salário"
          placeholder="Qual sua renda mensal?"
          keyboardType="numeric"
          icone={
            <Image
              source={require("../../../assets/icones/cifrao.png")}
              style={styles.iconeInput}
            />
          }
        />

        {/* DESPESAS */}
        <Input
          label="Despesas"
          placeholder="Seus gastos mensais"
          keyboardType="numeric"
          icone={
            <Image
              source={require("../../../assets/icones/cifraoproibido.png")}
              style={styles.iconeInputs}
            />
          }
        />

        {/* BOTÃO NO FINAL */}
        <View style={styles.botaoContainer}>
          <Button
            titulo="Confirmar"
            onPress={() => { }}
          />
        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 30,
  },

  conteudoSobreHeader: {
    marginTop: -290,
    paddingHorizontal: 16,
    flex: 1,
  },

  titulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 24,
    color: "#B7FF00",
    marginBottom: 15,
  },

  iconeInput: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  iconeInputs: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },

  botaoContainer: {
    marginTop: 250,
    paddingBottom: 20,
  },
});