import { ScrollView, Text, View, useWindowDimensions } from "react-native";

import { VictoryArea, VictoryAxis, VictoryChart } from "victory-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";

import { CATEGORIAS_POR_ID } from "@/features/menuMais/constants";
import { formatarMoeda } from "@/features/menuMais/utils";
import { useFinanceiro } from "@/features/financeiroContext";
import { calcularRotas } from "@/features/rotasDatas";
import { calcularSumario } from "@/features/sumarioData";
import { styles } from "../../styles/sumarioDetalhado";

const GRADIENTE_CARD: [string, string] = [
  Cores.fundo.cardAlt,
  Cores.fundo.navBarra,
];

// Cor dos gastos (laranja) e das economias (verde-limão), iguais às do Plano-B
const COR_GASTOS = "#FF8800";

// Tela "Sumário detalhado": aberta ao tocar no card Sumário do
// Dashboard e do Plano-B. Os valores vêm do que a pessoa registrou no
// Novo gasto e nas Metas.
export default function SumarioDetalhado() {
  const { width } = useWindowDimensions();

  // Gastos, entradas e metas registrados no app (FinanceiroProvider)
  const { transacoes, metas, salario } = useFinanceiro();

  const { nomeMes, ano, gastos, economias, ultimosMeses } = calcularSumario(
    transacoes,
    metas,
    salario
  );

  // Gastos do mês por categoria (mesmo cálculo e mesmas cores das Rotas)
  const { rotas: categorias } = calcularRotas(transacoes, salario);

  // Largura do gráfico = tela - margem lateral (16 x 2) - padding do card (18 x 2)
  const larguraGrafico = width - 32 - 36;

  // Pontos do gráfico (x = posição do mês, y = gasto)
  const dados = ultimosMeses.map((item, indice) => ({
    x: indice + 1,
    y: item.valor,
  }));

  // Gráfico só aparece quando houve gasto em algum dos 6 meses
  const temHistorico = ultimosMeses.some((item) => item.valor > 0);

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho: seta de voltar, título e mês, igual ao protótipo */}
        <HeaderInterno
          titulo="Sumário detalhado"
          subtitulo={`${nomeMes} ${ano}`}
        />

        {/* Conteúdo (logo abaixo do cabeçalho) */}
        <View style={styles.conteudoSobreHeader}>
          {/* Gastos | Economias */}
          <View style={styles.linhaTotais}>
            <Card gradiente={GRADIENTE_CARD} style={styles.cardTotal}>
              <Text style={styles.totalRotulo}>Gastos</Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.totalValor, { color: COR_GASTOS }]}
              >
                {formatarMoeda(gastos)}
              </Text>
            </Card>

            <Card gradiente={GRADIENTE_CARD} style={styles.cardTotal}>
              <Text style={styles.totalRotulo}>Economias</Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.totalValor, { color: Cores.destaque.limao }]}
              >
                {formatarMoeda(economias)}
              </Text>
            </Card>
          </View>

          {/* Gráfico de área: gastos dos últimos 6 meses */}
          <Card gradiente={GRADIENTE_CARD}>
            <Text style={styles.tituloCard}>Últimos 6 meses</Text>

            {!temHistorico ? (
              <Text style={styles.vazio}>
                Ainda não há gastos para mostrar.
              </Text>
            ) : (
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
            )}
          </Card>

          {/* Gastos por categoria */}
          <Card gradiente={GRADIENTE_CARD}>
            <Text style={styles.tituloCard}>Por categoria</Text>

            {categorias.length === 0 ? (
              <Text style={styles.vazio}>
                Nenhum gasto registrado neste mês.
              </Text>
            ) : null}

            {categorias.map((item) => {
              // Mesmo nome da categoria usado no Novo gasto
              const categoria =
                CATEGORIAS_POR_ID[item.categoriaId] ?? CATEGORIAS_POR_ID.outros;

              // A barra mostra quanto essa categoria pesa no total de gastos
              const porcentagem =
                gastos > 0 ? Math.min((item.atual / gastos) * 100, 100) : 0;

              return (
                <View key={item.categoriaId} style={styles.linhaCategoria}>
                  <View style={styles.topoCategoria}>
                    <Text style={styles.categoriaNome}>{categoria.rotulo}</Text>

                    <Text style={styles.categoriaValor}>
                      {formatarMoeda(item.atual)}
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
    </View>
  );
}