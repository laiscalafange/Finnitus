import { useMemo } from "react";
import { Text, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";

import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";
import { GRADIENTS } from "../../shared/constants/Gradientes";
import { Rotas } from "../../shared/constants/Rotas";

import { buscarPlanoPago } from "@/features/planosData";
import { formatarDataExtenso, somarDias } from "@/features/pagamentoUtils";
import { styles } from "../../styles/premiumAtivo";

// Tela "Você é Premium agora!": aparece depois de confirmar o pagamento.
export default function PremiumAtivo() {
  const router = useRouter();

  // Plano que foi contratado (chega como parâmetro de rota)
  const { plano: planoId } = useLocalSearchParams<{ plano?: string }>();
  const plano = buscarPlanoPago(planoId);

  // Data da primeira cobrança = hoje + dias de teste grátis (só se o plano tiver teste)
  const dataCobranca = useMemo(
    () =>
      plano.testeDias
        ? formatarDataExtenso(somarDias(new Date(), plano.testeDias))
        : null,
    [plano.testeDias]
  );

  // Leva pro Plano-B, um dos recursos Premium. dismissTo fecha as telas de
  // Premium/Pagamento que ficaram abertas por baixo.
  function explorarRecursos() {
    router.dismissTo(Rotas.planoB);
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fundo}
    >
      <View style={styles.conteudo}>
        {/* Círculo verde-limão com o check (mesmo gradiente do card Premium) */}
        <LinearGradient
          colors={GRADIENTS.premium.colors}
          start={GRADIENTS.premium.start}
          end={GRADIENTS.premium.end}
          style={styles.circulo}
        >
          <Check size={48} color={Cores.texto.contraste} strokeWidth={3} />
        </LinearGradient>

        <Text style={styles.titulo}>Você é Premium agora!</Text>

        {dataCobranca ? (
          <Text style={styles.texto}>
            Seu teste gratuito começou. Você será cobrado em{" "}
            <Text style={styles.textoDestaque}>{dataCobranca}</Text> caso não
            cancele antes.
          </Text>
        ) : (
          <Text style={styles.texto}>
            Sua assinatura {plano.nome} foi ativada. Você será cobrado{" "}
            <Text style={styles.textoDestaque}>
              {plano.preco}
              {plano.periodo}
            </Text>
            .
          </Text>
        )}

        <View style={styles.botao}>
          <Button
            titulo="Explorar recursos Premium"
            onPress={explorarRecursos}
          />
        </View>
      </View>
    </LinearGradient>
  );
}