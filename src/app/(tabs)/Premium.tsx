import { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  SafeAreaView, //significa que tem uma versão atualizada!
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { HeaderPremium } from "../../shared/components/Header";
import { GRADIENTS } from "../../shared/constants/Gradientes";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";

// Formato de cada plano exibido no carrossel
interface Plano {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  periodo?: string;
  teste?: string;
  badge?: string;
  beneficios: string[];
}

// Conteúdo dos 3 planos. Para editar preço/benefícios, mexe só aqui.
const PLANOS: Plano[] = [
  {
    id: "basico",
    nome: "Básico",
    descricao: "Para quem está começando a organizar as finanças",
    preco: "Grátis",
    beneficios: [
      "Controle de gastos",
      "Até 3 metas ativas",
      "Relatório mensal simples",
    ],
  },
  {
    id: "mega-finn",
    nome: "Mega finn",
    badge: "Mais popular",
    descricao: "Para quem deseja ter controle sobre o próprio futuro",
    preco: "R$15,95",
    periodo: "/mês",
    teste: "7 dias de teste grátis!",
    beneficios: [
      "Tudo do Básico",
      "Metas ilimitadas",
      "Plano-B completo (simulação de imprevistos)",
      "Calendário inteligente de contas e vencimentos",
      "Relatórios e gráficos avançados",
    ],
  },
  {
    id: "infinitos",
    nome: "Infinitos",
    descricao: "Para quem quer o máximo de recursos e liberdade",
    preco: "R$29,90",
    periodo: "/mês",
    beneficios: [
      "Tudo do Mega Finn",
      "Consultoria financeira mensal",
      "Metas compartilhadas em família",
      "Suporte prioritário",
    ],
  },
];

export default function Premium() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(1); // começa no Mega Finn

  function irParaPlano(indice: number) {
    setIndiceAtivo(indice);
    scrollRef.current?.scrollTo({ x: indice * width, animated: true });
  }

  function aoTerminarSwipe(evento: NativeSyntheticEvent<NativeScrollEvent>) {
    const indice = Math.round(evento.nativeEvent.contentOffset.x / width);
    setIndiceAtivo(indice);
  }

  return (
    <LinearGradient
      colors={GRADIENTS.background.colors}
      start={GRADIENTS.background.start}
      end={GRADIENTS.background.end}
      style={styles.fundo}
    >
      <SafeAreaView style={styles.safe}>
        <HeaderPremium/>

        {/* Seletor de plano */}
        <View style={styles.abas}>
          {PLANOS.map((plano, indice) => (
            <TouchableOpacity
              key={plano.id}
              style={[styles.aba, indice === indiceAtivo && styles.abaAtiva]}
              onPress={() => irParaPlano(indice)}
            >
              <Text
                style={[
                  styles.abaTexto,
                  indice === indiceAtivo && styles.abaTextoAtivo,
                ]}
              >
                {plano.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Carrossel de planos (swipe na horizontal) */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={aoTerminarSwipe}
          contentOffset={{ x: indiceAtivo * width, y: 0 }}
          style={styles.carrossel}
        >
          {PLANOS.map((plano) => (
            <View key={plano.id} style={{ width }}>
              {/* Scroll vertical: deixa ler o card inteiro sem espremer o texto */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.paginaCard}
              >
                <View style={styles.card}>
                  {plano.badge && (
                    <Text style={styles.badge}>{plano.badge}</Text>
                  )}
                  <Text style={styles.nome}>{plano.nome}</Text>
                  <Text style={styles.descricao}>{plano.descricao}</Text>

                  <Text style={styles.preco}>
                    {plano.preco}
                    {plano.periodo && (
                      <Text style={styles.periodo}>{plano.periodo}</Text>
                    )}
                  </Text>
                  {plano.teste && (
                    <Text style={styles.teste}>{plano.teste}</Text>
                  )}

                  <View style={styles.divisor}>
                    <View style={styles.linha} />
                    <Text style={styles.divisorTexto}>Benefícios</Text>
                    <View style={styles.linha} />
                  </View>

                  {plano.beneficios.map((beneficio) => (
                    <View key={beneficio} style={styles.beneficio}>
                      <Text style={styles.bolinha}>•</Text>
                      <Text style={styles.beneficioTexto}>{beneficio}</Text>
                    </View>
                  ))}

                  <TouchableOpacity style={styles.botao} activeOpacity={0.8}>
                    <Text style={styles.botaoTexto}>Obter agora</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.naoObrigado}>Não, obrigado</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },

  // Seletor (Básico | Mega Finn | Infinitos)
  abas: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: -280,
    padding: 4,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  abaAtiva: {
    backgroundColor: Cores.destaque.limao,
  },
  abaTexto: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.principal,
  },
  abaTextoAtivo: {
    color: Cores.roxo.escuro,
  },

  // Carrossel
  carrossel: {
    flex: 1,
    marginTop: 1,
  },
  paginaCard: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Card do plano
  card: {
    backgroundColor: "#301a52b9",
    borderColor: Cores.destaque.limao,
    borderWidth: 1,
    borderRadius: 9,
    padding: 22,
  },
  badge: {
    alignSelf: "center",
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.destaque.limao,
    marginBottom: 10,
  },
  nome: {
    textAlign: "center",
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 26,
    color: Cores.base.branco,
  },
  descricao: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.texto.principal,
    marginTop: 8,
  },
  preco: {
    textAlign: "center",
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: Cores.base.branco,
    marginTop: 16,
  },
  periodo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.principal,
  },
  teste: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.medium,
    fontSize: 12,
    color: Cores.texto.principal,
    marginTop: 4,
  },

  divisor: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 14,
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: Cores.destaque.limao,
    opacity: 0.5,
  },
  divisorTexto: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.destaque.limao,
    marginHorizontal: 10,
  },

  beneficio: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bolinha: {
    color: Cores.destaque.limao,
    fontSize: 14,
    marginRight: 8,
  },
  beneficioTexto: {
    flex: 1,
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.base.branco,
  },

  botao: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: Cores.destaque.limao,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 20,
    color: Cores.destaque.limao,
  },
  naoObrigado: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: Cores.texto.principal,
    marginTop: 14,
  },
});