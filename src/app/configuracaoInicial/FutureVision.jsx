import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { Button } from "../../shared/components/Button";
// deixei o mesmo por que o estilo é o mesmo da página de esqueci minha senha
import { styles } from "../../styles/FutureVisionStyles";
import { useState } from 'react';
import { Benefit } from "../../shared/components/Benefit/Benefit";



export default function FutureVision() {
  const roteador = useRouter();

  return (
    <View style={styles.container}>
  

      <View style={styles.content}>
        <Text style={styles.titulo}>
          <Text style={styles.tituloDestaque}>Visão</Text> de futuro
        </Text>

        <Text style={styles.subtitulo}>
          Resultados futuros
        </Text>

        <View style={styles.cards}>
          <Benefit
            icon="💲"
            title="Controle seus gastos"
            description="Registre despesas e entenda para onde seu dinheiro vai"
          />

          <Benefit
            icon="💸"
            title="Decisões financeiras melhores"
            description="Escolhas mais seguras para seu futuro"
          />

          <Benefit
            icon="💰"
            title="Crie o hábito de poupar"
            description="Dicas práticas para guardar dinheiro no dia a dia"
          />
      </View>
      

      <Button
        titulo="Começar jornada"
        onPress={() => roteador.push("/proximaTela")}
      />
    </View>
      </View> 
  );
} 