import { ScrollView, View, useWindowDimensions } from "react-native";
import { Text } from "@/shared/components/Texto";

import { VictoryArea, VictoryAxis, VictoryChart } from "victory-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";

import { CATEGORIAS_POR_ID } from "@/features/menuMais/constants";
import { useMoedaVisivel } from "@/features/configuracoesContext";
import { useFinanceiro } from "@/features/financeiroContext";
import { calcularRotas } from "@/features/rotasDatas";
import { calcularSumario } from "@/features/sumarioData";
import { styles } from "../../styles/sumarioDetalhado";

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.77)",
  "rgba(33, 18, 53, 0.82)",
];

const COR_GASTOS = "#cf6b1f";

export default function SumarioDetalhado() {
  const moedaVisivel = useMoedaVisivel();
  const { width } = useWindowDimensions();

  const { transacoes, metas, salario } = useFinanceiro();

  const { nomeMes, ano, gastos, economias, ultimosMeses } =
    calcularSumario(
      transacoes,
      metas,
      salario
    );

  const { rotas: categorias } = calcularRotas(
    transacoes,
    salario
  );

  const larguraGrafico = width - 32 - 36;

  const dados = ultimosMeses.map((item, indice) => ({
    x: indice + 1,
    y: item.valor,
  }));

  const temHistorico = ultimosMeses.some(
    item => item.valor > 0
  );

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno
          titulo="Sumário detalhado"
          subtitulo={`${nomeMes} ${ano}`}
        />

        <View style={styles.conteudoSobreHeader}>

          {/* GASTOS E ECONOMIAS */}

          <View style={styles.linhaTotais}>
            <Card
              gradiente={GRADIENTE_CARD}
              style={styles.cardTotal}
            >
              <Text style={styles.totalRotulo}>
                Gastos
              </Text>

              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[
                  styles.totalValor,
                  { color: COR_GASTOS },
                ]}
              >
                {moedaVisivel(gastos)}
              </Text>
            </Card>

            <Card
              gradiente={GRADIENTE_CARD}
              style={styles.cardTotal}
            >
              <Text style={styles.totalRotulo}>
                Economias
              </Text>

              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[
                  styles.totalValor,
                  { color: Cores.destaque.limao, },
                ]}
              >
                {moedaVisivel(economias)}
              </Text>
            </Card>
          </View>

          {/* GRÁFICO */}

          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.cardPadrao}
          >
            <Text style={styles.tituloCard}>
              Últimos 6 meses
            </Text>

            {!temHistorico ? (
              <Text style={styles.vazio}>
                Ainda não há gastos para mostrar.
              </Text>
            ) : (
              <View style={styles.graficoContainer}>
                <VictoryChart
                  width={larguraGrafico}
                  height={180}
                  padding={{
                    top: 15,
                    bottom: 30,
                    left: 18,
                    right: 18,
                  }}
                  domainPadding={{ y: [0, 10] }}
                >
                  <VictoryAxis
                    tickValues={ultimosMeses.map(
                      (_, indice) => indice + 1
                    )}
                    tickFormat={ultimosMeses.map(
                      item => item.mes
                    )}
                    style={{
                      axis: {
                        stroke: "transparent",
                      },
                      grid: {
                        stroke: "transparent",
                      },
                      ticks: {
                        stroke: "transparent",
                      },
                      tickLabels: {
                        fill: "#C7A9F5",
                        fontSize: 11,
                        fontFamily:
                          FONTS.quicksand.semibold,
                      },
                    }}
                  />

                  <VictoryArea
                    data={dados}
                    style={{
                      data: {
                        fill: "#A357FF",
                        fillOpacity: 0.22,
                        stroke: "#B78AFF",
                        strokeWidth: 2.5,
                      },
                    }}
                  />
                </VictoryChart>
              </View>
            )}
          </Card>

          {/* GASTOS POR CATEGORIA */}

          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.cardPadrao}
          >
            <Text style={styles.tituloCard}>
              Por categoria
            </Text>

            {categorias.length === 0 ? (
              <Text style={styles.vazio}>
                Nenhum gasto registrado neste mês.
              </Text>
            ) : null}

            {categorias.map(item => {
              const categoria =
                CATEGORIAS_POR_ID[item.categoriaId] ??
                CATEGORIAS_POR_ID.outros;

              const porcentagem =
                gastos > 0
                  ? Math.min(
                      (item.atual / gastos) * 100,
                      100
                    )
                  : 0;

              return (
                <View
                  key={item.categoriaId}
                  style={styles.linhaCategoria}
                >
                  <View style={styles.topoCategoria}>
                    <View style={styles.categoriaIdentificacao}>
                      <View
                        style={[
                          styles.categoriaPonto,
                          { backgroundColor: item.cor },
                        ]}
                      />

                      <Text style={styles.categoriaNome}>
                        {categoria.rotulo}
                      </Text>
                    </View>

                    <Text style={styles.categoriaValor}>
                      {moedaVisivel(item.atual)}
                    </Text>
                  </View>

                  <View style={styles.progressoLinha}>
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

                    <Text style={styles.categoriaPercentual}>
                      {porcentagem.toFixed(1)}%
                    </Text>
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