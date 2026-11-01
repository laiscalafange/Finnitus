import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";
import { GRADIENTS } from "../../shared/constants/Gradientes";
import { Rotas } from "../../shared/constants/Rotas";
import { buscarPlanoPago } from "@/features/planosData";
import { styles } from "../../styles/premiumAtivo";

export default function PremiumAtivo() {
  const router = useRouter();
  const { plano: planoId } = useLocalSearchParams<{ plano?: string }>();
  const plano = buscarPlanoPago(planoId);
  return (
    <LinearGradient colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fundo}>
      <View style={styles.conteudo}>
        <LinearGradient colors={GRADIENTS.premium.colors}
          start={GRADIENTS.premium.start} end={GRADIENTS.premium.end}
          style={styles.circulo}>
          <Check size={48} color={Cores.texto.contraste} strokeWidth={3} />
        </LinearGradient>
        <Text style={styles.titulo}>Prévia concluída!</Text>
        <Text style={styles.texto}>
          Você conheceu o conceito do plano {plano.nome}. Nenhuma assinatura
          foi ativada, nenhum pagamento foi feito e não haverá cobrança.
          Os recursos do protótipo continuam disponíveis conforme a versão
          de demonstração do aplicativo.
        </Text>
        <View style={styles.botao}>
          <Button titulo="Explorar o aplicativo" onPress={() => router.dismissTo(Rotas.planoB)} />
        </View>
      </View>
    </LinearGradient>
  );
}
