import { ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { buscarPlano } from "@/features/planosData";
import { METODOS_SIMULADOS } from "@/features/pagamentoUtils";
import { Button } from "@/shared/components/Button";
import { Cores } from "@/shared/constants/Cores";
import { Rotas } from "@/shared/constants/Rotas";
import { FUNDO_PAGAMENTO, styles } from "@/styles/pagamento";

export default function PremiumAtivo() {
  const router = useRouter();
  const { plano: planoId, metodo: metodoId } = useLocalSearchParams<{
    plano?: string;
    metodo?: string;
  }>();
  const plano = buscarPlano(planoId);
  const metodo = METODOS_SIMULADOS.find(({ id }) => id === metodoId);

  if (!plano) {
    return <Redirect href={Rotas.premium} />;
  }

  if (plano.periodo && !metodo) {
    return <Redirect href={{ pathname: Rotas.pagamento, params: { plano: plano.id } }} />;
  }

  return (
    <LinearGradient colors={FUNDO_PAGAMENTO} style={styles.fundo}>
      <SafeAreaView style={styles.fundo}>
        <ScrollView contentContainerStyle={styles.confirmacao}>
          <View style={styles.emblema}>
            <Check size={44} color={Cores.destaque.limao} strokeWidth={2.5} />
          </View>
          <Text accessibilityRole="header" style={styles.titulo}>Simulação concluída</Text>
          <Text style={[styles.texto, styles.textoCentralizado]}>
            {plano.periodo && metodo
              ? `Você simulou a compra do plano ${plano.nome} com ${metodo.titulo}.`
              : `Você concluiu a demonstração do plano ${plano.nome}.`}
            {" "}Sua conta continua com o acesso atual.
          </Text>
          <Button
            titulo="Voltar aos planos"
            variante="terciario"
            onPress={() => router.dismissTo(Rotas.premium)}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
