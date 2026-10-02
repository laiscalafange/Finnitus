import { ScrollView, Text, View, useWindowDimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { VictoryArea, VictoryAxis, VictoryChart } from "victory-native";

import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";

import { CATEGORIAS_POR_ID } from "@/features/menuMais/constants";
import { formatarMoeda } from "@/features/menuMais/utils";
import { SUMARIO_DETALHADO_MOCK } from "@/features/sumarioData";
import { styles } from "../../styles/sumarioDetalhado";

// Gradientes iguais aos das outras telas internas
const GRADIENTE_FUNDO: [string, string, string] = [
  "#160B24",
  "#08070A",
  "#160B24",
];
const GRADIENTE_CARD: [string, string] = [
  Cores.fundo.cardAlt,
  Cores.fundo.navBarra,
];

// Cor dos gastos (laranja) e das economias (verde-limão), iguais às do Plano-B
const COR_GASTOS = "#FF8800";

// 3000 -> "R$ 3.000" (os cards do topo não mostram centavos)
function moedaInteira(valor: number): string {
  return `R$ ${valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
}

// Tela "Sumário detalhado": aberta ao tocar no card Sumário do
// Dashboard e do Plano-B.
export default function SumarioDetalhado() {
  const { width } = useWindowDimensions();

  const { mes, ano, gastos, economias, ultimosMeses, categorias } =
    SUMARIO_DETALHADO_MOCK;

  // Largura do gráfico = tela - margem lateral (16 x 2) - padding do card (18 x 2)
  const larguraGrafico = width - 32 - 36;

  // Pontos do gráfico (x = posição do mês, y = gasto)
  const dados = ultimosMeses.map((item, indice) => ({
    x: indice + 1,
    y: item.valor,
  }));

  return (
    <LinearGradient
      colors={GRADIENTE_FUNDO}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho: seta de voltar, título e mês, igual ao protótipo */}
        <HeaderInterno
          titulo="Sumário detalhado"
          subtitulo={`${mes} ${ano}`}
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        {/* Conteúdo (sobe por cima da faixa roxa do header) */}
        <View style={styles.conteudoSobreHeader}>
          {/* Gastos | Economias */}
          <View style={styles.linhaTotais}>
            <Card gradiente={GRADIENTE_CARD} style={styles.cardTotal}>
              <Text style={styles.totalRotulo}>Gastos</Text>
              <Text style={[styles.totalValor, { color: COR_GASTOS }]}>
                {moedaInteira(gastos)}
              </Text>
            </Card>

            <Card gradiente={GRADIENTE_CARD} style={styles.cardTotal}>
              <Text style={styles.totalRotulo}>Economias</Text>
              <Text
                style={[styles.totalValor, { color: Cores.destaque.limao }]}
              >
                {moedaInteira(economias)}
              </Text>
            </Card>
          </View>

          {/* Gráfico de área: gastos dos últimos 6 meses */}
          <Card gradiente={GRADIENTE_CARD}>
            <Text style={styles.tituloCard}>Últimos 6 meses</Text>

            <VictoryChart
              width={larguraGrafico}
              height={170}
              padding={{ top: 10, bottom: 30, left: 0, right: 0 }}
              domainPadding={{ y: [0, 10] }}
            >
              <VictoryAxis
                tickValues={ultimosMeses.map((_, indice) => indice + 1)}
                tickFormat={ultimosMeses.map((item) => item.mes)}
                style={{
                  axis: { stroke: "transparent" },
                  grid: { stroke: "transparent" },
                  ticks: { stroke: "transparent" },
                  tickLabels: {
                    fill: Cores.texto.claro,
                    fontSize: 12,
                    fontFamily: FONTS.quicksand.semibold,
                  },
                }}
              />

              <VictoryArea
                data={dados}
                style={{
                  data: {
                    fill: Cores.destaque.limao,
                    fillOpacity: 0.25,
                    stroke: Cores.destaque.limao,
                    strokeWidth: 2,
                  },
                }}
              />
            </VictoryChart>
          </Card>

          {/* Gastos por categoria */}
          <Card gradiente={GRADIENTE_CARD}>
            <Text style={styles.tituloCard}>Por categoria</Text>

            {categorias.map((item) => {
              // Mesmo nome da categoria usado no Novo gasto
              const categoria =
                CATEGORIAS_POR_ID[item.categoriaId] ?? CATEGORIAS_POR_ID.outros;

              // A barra mostra quanto essa categoria pesa no total de gastos
              const porcentagem = Math.min((item.valor / gastos) * 100, 100);

              return (
                <View key={item.categoriaId} style={styles.linhaCategoria}>
                  <View style={styles.topoCategoria}>
                    <Text style={styles.categoriaNome}>{categoria.rotulo}</Text>

                    <Text style={styles.categoriaValor}>
                      {formatarMoeda(item.valor)}
                    </Text>
                  </View>

                  <View style={styles.barraFundo}>
                    <View
                      style={[
                        styles.barraPreenchida,
                        {
                          width: `${porcentagem}%`,
                          backgroundColor: item.cor,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}