import { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { Wand2, Plane, Car, Home, CreditCard, Wrench, Plus } from "lucide-react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { SelectCard } from "../../shared/components/SelectCard";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/FutureGoalsStyles";
import { useRouter } from "expo-router";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";
import { Cores } from "@/shared/constants/Cores";
import { useFinanceiro } from "../../features/financeiroContext";



const OPTIONS = [
  { id: "emergencia", label: "Fundo de emergência", icon: Wand2 },
  { id: "viagem", label: "Viagem", icon: Plane },
  { id: "carro", label: "Carro novo", icon: Car },
  { id: "casa", label: "Casa nova", icon: Home },
  { id: "divida", label: "Pagar dívida", icon: CreditCard },
  { id: "reforma", label: "Reforma", icon: Wrench },
  
];

export default function MetasFuturas() {
  const roteador = useRouter();
  const { metasSelecionadas, setMetasSelecionadas } = useFinanceiro();
  const [selecionados, setSelecionados] = useState<string[]>(metasSelecionadas);

  function toggle(id: string) {
    setSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  function confirmar() {
    setMetasSelecionadas(selecionados);
    roteador.push("/configuracaoInicial/FutureVision");
  }

  return (
    <View style={{ flex: 1 }}>
          <BackgroundGradient />

    <View style={styles.container}>
      

      {/* Cabeçalho */}
      <View style={styles.header}>
        <ProgressDots total={4} atual={3} />

  <Text style={styles.titulo} maxFontSizeMultiplier={1.1}>
    <Text style={styles.tituloDestaque}>Metas</Text> futuras
  </Text>
        <Text style={styles.subtitulo} maxFontSizeMultiplier={1.1}>
          O que pretende alcançar
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Sonhos futuros
      </Text>

      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
  {OPTIONS.map(({ id, label, icon: Icon }) => (
    <SelectCard
      key={id}
      label={label}
      icon={
        <Icon
          size={22}
          color={selecionados.includes(id) ? Cores.destaque.limao : Cores.roxo.claro}
        />
      }
      selected={selecionados.includes(id)}
      onPress={() => toggle(id)}
    />
  ))}

  {/* Item de ação, não de seleção */}
  <SelectCard
  label="Objetivo personalizado"
  icon={<Plus size={22} color={Cores.roxo.claro} />}
  showCheckbox={false}
  onPress={() => {
    // abrir modal/tela para criar meta personalizada
  }}
/>
</ScrollView>

      <View style={styles.botao}>
  {/*<Button
    variante="primario"
    titulo="Confirmar"
    onPress={() => console.log(selecionados)}
  />*/}
  <Button
    variante="primario"
    titulo="Confirmar"
    onPress={confirmar}
    />
</View>

    </View>
    </View>
  );
}