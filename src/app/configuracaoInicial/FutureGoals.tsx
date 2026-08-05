import { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { Wand2, Plane, Car, Home, CreditCard, Wrench, Plus } from "lucide-react-native";

import { SelectCard } from "../../shared/components/SelectCard";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/FutureGoalsStyles";

const OPTIONS = [
  { id: "emergencia", label: "Fundo de emergência", icon: Wand2 },
  { id: "viagem", label: "Viagem", icon: Plane },
  { id: "carro", label: "Carro novo", icon: Car },
  { id: "casa", label: "Casa nova", icon: Home },
  { id: "divida", label: "Pagar dívida", icon: CreditCard },
  { id: "reforma", label: "Reforma", icon: Wrench },
  { id: "personalizado", label: "Objetivo personalizado", icon: Plus },
];

export default function MetasFuturas() {
  const [selecionados, setSelecionados] = useState<string[]>([]);

  function toggle(id: string) {
    setSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>
  <Text style={styles.titulo}>
    <Text style={styles.tituloDestaque}>Metas</Text> futuras
  </Text>
        <Text style={styles.subtitulo}>
          O que pretende alcançar
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Sonhos futuros
      </Text>

      <ScrollView
        style={styles.lista}
        showsVerticalScrollIndicator={false}
      >
        {OPTIONS.map(({ id, label, icon: Icon }) => (
          <SelectCard
            key={id}
            label={label}
            icon={
              <Icon
                size={22}
                color={
                  selecionados.includes(id)
                    ? "#B7FF00"
                    : "#7C3AED"
                }
              />
            }
            selected={selecionados.includes(id)}
            onPress={() => toggle(id)}
          />
        ))}
      </ScrollView>

      <View style={styles.botao}>
  <Button
    variante="primario"
    titulo="Confirmar"
    onPress={() => console.log(selecionados)}
  />
</View>

    </View>
  );
}