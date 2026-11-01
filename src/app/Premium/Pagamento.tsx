import { ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HeaderMP } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";
import { Rotas } from "../../shared/constants/Rotas";
import { buscarPlanoPago } from "@/features/planosData";
import { styles } from "../../styles/pagamento";

/** Rota legada /Premium/Pagamento, mantida sem coleta de cartões/PIX. */
export default function Pagamento() {
  const router = useRouter();
  const { plano: planoId } = useLocalSearchParams<{ plano?: string }>();
  const plano = buscarPlanoPago(planoId);

  return (
    <LinearGradient colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <HeaderMP titulo="Prévia dos planos" subtitulo="Projeto acadêmico"
          mostrarPremium={false} mostrarNotificacao={false} />
        <View style={styles.formulario}>
          <Card gradiente={[Cores.fundo.cardAlt, Cores.fundo.navBarra]} style={styles.resumo}>
            <Text style={styles.resumoNome}>{plano.nome}</Text>
            <Text style={styles.resumoPreco}>{plano.preco}</Text>
            <Text style={styles.resumoInfo}>
              Esta é uma demonstração acadêmica. Não vendemos assinaturas, não
              processamos pagamentos, não solicitamos cartão ou chave PIX e
              não haverá cobranças futuras.
            </Text>
            <Text style={[styles.resumoInfo, { marginTop: 12 }]}>
              A escolha serve apenas para conhecer a proposta dos planos.
              Ela não libera funcionalidades restritas nem altera sua conta.
            </Text>
          </Card>
          <Button titulo="Continuar demonstração" onPress={() => router.replace({
            pathname: Rotas.premiumAtivo, params: { plano: plano.id },
          })} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
