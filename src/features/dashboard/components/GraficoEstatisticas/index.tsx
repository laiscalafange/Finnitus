import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine } from 'victory-native'
import { EstatisticaResumo } from '../../types'
import { styles } from './styles'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

type Props = {
  dados?: EstatisticaResumo[]
  onPress?: () => void
}

const DIAS_SEMANA = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']

/**
 * O gráfico da Home usa exatamente a mesma composição visual do Dashboard:
 * - barras dos gastos desta semana;
 * - barras da semana passada;
 * - linha da semana atual;
 * - linha da semana passada.
 *
 * A única adaptação é a largura, calculada para caber no card da Home.
 */
export function GraficoEstatisticas({ dados, onPress }: Props) {
  const pontos = dados ?? []
  const { width: telaWidth } = useWindowDimensions()
  const chartWidth = Math.max(280, telaWidth - 70)

  const dadosBarras = pontos.map((item, index) => ({
    x: index + 1,
    y: item.receitas,
  }))

  const dadosBarrasPassadas = pontos.map((item, index) => ({
    x: index + 1.15,
    y: item.despesas,
  }))

  const dadosLinha = pontos.map((item, index) => ({
    x: index + 1.10,
    y: item.despesas + 7,
  }))

  const dadosLinhaVerde = pontos.map((item, index) => ({
    x: index + 1,
    y: item.receitas + 8,
  }))

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Estatísticas</Text>

        <View style={styles.legenda}>
          <View style={styles.legendaItem}>
            <View style={[styles.ponto, styles.pontoReceita]} />
            <Text style={styles.legendaTexto}>Gastos dessa semana</Text>
          </View>

          <View style={styles.legendaItem}>
            <View style={[styles.ponto, styles.pontoDespesa]} />
            <Text style={styles.legendaTexto}>Gastos da semana passada</Text>
          </View>
        </View>
      </View>

      <View style={styles.abas}>
        <View style={[styles.aba, styles.abaAtiva]}>
          <Text style={[styles.abaTexto, styles.abaTextoAtiva]}>Semana</Text>
        </View>
        <View style={styles.aba}>
          <Text style={styles.abaTexto}>Mês</Text>
        </View>
      </View>

      {pontos.length > 0 ? (
        <View style={styles.grafico}>
          <VictoryChart
            width={chartWidth}
            height={166}
            padding={{ top: 8, bottom: 30, left: 8, right: 8 }}
            domainPadding={{ x: 12, y: 8 }}
          >
            <VictoryAxis
              tickValues={[1, 2, 3, 4, 5, 6, 7]}
              tickFormat={DIAS_SEMANA}
              style={{
                axis: { stroke: 'transparent' },
                grid: { stroke: '#ffffff12' },
                ticks: { stroke: 'transparent' },
                tickLabels: {
                  fill: Cores.texto.principal,
                  fontSize: 14,
                  fontFamily: FONTS.quicksand.bold,
                },
              }}
            />

            <VictoryBar
              data={dadosBarras}
              style={{
                data: {
                  fill: Cores.destaque.limao,
                  width: 12,
                },
              }}
              cornerRadius={{ top: 5 }}
            />

            <VictoryBar
              data={dadosBarrasPassadas}
              style={{
                data: {
                  fill: Cores.estado.perigo,
                  width: 11,
                },
              }}
              cornerRadius={{ top: 5 }}
            />

            <VictoryLine
              data={dadosLinhaVerde}
              interpolation="natural"
              style={{
                data: {
                  stroke: Cores.destaque.limao,
                  strokeWidth: 2.5,
                },
              }}
            />

            <VictoryLine
              data={dadosLinha}
              interpolation="natural"
              style={{
                data: {
                  stroke: Cores.estado.perigo,
                  strokeWidth: 2.5,
                },
              }}
            />
          </VictoryChart>
        </View>
      ) : (
        <View style={styles.vazio}>
          <Text style={styles.vazioTitulo}>Dados de estatísticas ainda não disponíveis</Text>
          <Text style={styles.vazioTexto}>
            Cadastre seus dados financeiros para visualizar o resumo.
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
