import { useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, type ScrollViewInstance, Text, TouchableOpacity, View, useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { HeaderMP } from "../../shared/components/Header";
import { Button } from "../../shared/components/Button";
import { Rotas } from "../../shared/constants/Rotas";
import { PLANO_PADRAO_ID, PLANOS } from "@/features/planosData";
import { styles } from "@/styles/premium";


export default function Premium() {
  const router = useRouter();

  // Largura da tela, usada pra calcular o scroll do carrossel (1 página = 1 plano)
  const { width } = useWindowDimensions();

  // Referência do ScrollView horizontal, pra poder mover ele manualmente
  // quando o usuário clica numa aba em vez de arrastar
  const scrollRef = useRef<ScrollViewInstance>(null);

  const [indiceAtivo, setIndiceAtivo] = useState(
    () => PLANOS.findIndex((plano) => plano.id === PLANO_PADRAO_ID)
  );

  // Quando clica numa aba (Básico/Mega finn/Infinitos), rola o carrossel até ela
  function irParaPlano(indice: number) {
    setIndiceAtivo(indice);

    scrollRef.current?.scrollTo({
      x: indice * width,
      animated: true,
    });
  }

  // Quando o usuário arrasta o carrossel manualmente, atualiza qual aba fica ativa
  // com base em qual "página" ele parou
  function aoTerminarSwipe(
    evento: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    const indice = Math.round(
      evento.nativeEvent.contentOffset.x / width
    );

    setIndiceAtivo(indice);
  }

  function aoConfirmarPlano(planoId: string) {
    router.push({
      pathname: Rotas.pagamento,
      params: { plano: planoId },
    });
  }

  // Ao clicar em "Não obrigado": só fecha a oferta e volta pra tela anterior
  function aoRecusarPlano() {
    router.back();
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fundo}
    >
      {/* Cabeçalho da tela, com título e subtítulo */}
      <HeaderMP
        titulo="Seja Premium!"
        subtitulo="Detalhes"
        mostrarPremium={false}
      />

      {/* Seletor de plano (abas Básico / Mega finn / Infinitos) */}
      <View style={styles.abas}>
        {PLANOS.map((plano, indice) => (
          <TouchableOpacity
            key={plano.id}
            style={[
              styles.aba,
              // Aplica o estilo de "ativa" só na aba correspondente ao plano atual
              indice === indiceAtivo && styles.abaAtiva,
            ]}
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

      {/* Carrossel horizontal, cada página é um plano */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={aoTerminarSwipe}
        onLayout={() => scrollRef.current?.scrollTo({
          x: indiceAtivo * width,
          animated: false,
        })}
        contentOffset={{
          x: indiceAtivo * width,
          y: 0,
        }}
        style={styles.carrossel}
      >
        {PLANOS.map((plano) => (
          <View
            key={plano.id}
            style={{ width }}
          >
            {/* Scroll vertical interno, caso o conteúdo do card não caiba na tela */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.paginaCard}
            >
              <View style={styles.card}>

                {/* Badge "Mais popular" — só aparece se o plano tiver essa propriedade */}
                {plano.badge && (
                  <Text style={styles.badge}>
                    {plano.badge}
                  </Text>
                )}

                <Text style={styles.nome}>
                  {plano.nome}
                </Text>

                <Text style={styles.descricao}>
                  {plano.descricao}
                </Text>

                <Text style={styles.preco}>
                  {plano.preco}

                  {/* "/mês" só aparece nos planos pagos */}
                  {plano.periodo && (
                    <Text style={styles.periodo}>
                      {plano.periodo}
                    </Text>
                  )}
                </Text>

                {plano.teste && <Text style={styles.teste}>{plano.teste}</Text>}
                {plano.periodo && (
                  <Text style={styles.teste}>Valores demonstrativos, sem cobrança.</Text>
                )}

                {/* Linha divisória com o texto "Benefícios" no meio */}
                <View style={styles.divisor}>
                  <View style={styles.linha} />

                  <Text style={styles.divisorTexto}>
                    Benefícios
                  </Text>

                  <View style={styles.linha} />
                </View>

                {/* Lista de benefícios do plano, com bolinha na frente de cada um */}
                {plano.beneficios.map((beneficio) => (
                  <View
                    key={beneficio}
                    style={styles.beneficio}
                  >
                    <Text style={styles.bolinha}>
                      •
                    </Text>

                    <Text style={styles.beneficioTexto}>
                      {beneficio}
                    </Text>
                  </View>
                ))}

                <Button
                  titulo="Obter Agora"
                  variante="terciario"
                  onPress={() => aoConfirmarPlano(plano.id)}
                />

                {/* Botão somente texto — recusa a oferta e volta pra tela anterior */}
                <Button
                  titulo="Não obrigado"
                  variante="botaotexto"
                  onPress={aoRecusarPlano}
                />

              </View>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
