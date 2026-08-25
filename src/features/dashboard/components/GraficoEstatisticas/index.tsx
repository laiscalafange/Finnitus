import { Text, View } from 'react-native'
import Svg, { Polyline, Line, Rect, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg'
import { EstatisticaResumo } from '../../types'
import { styles } from './styles'
import { Cores } from '@/shared/constants/Cores'

type Props = {
  dados?: EstatisticaResumo[]
  onPress?: () => void
}

export function GraficoEstatisticas({ dados, onPress }: Props) {
  const pontos = dados ?? []
  const maximo = Math.max(...pontos.flatMap(item => [item.receitas, item.despesas]), 1)
  const largura = 260
  const altura = 92
  const margemX = 10
  const margemY = 8
  const passo = pontos.length > 1 ? (largura - margemX * 2) / (pontos.length - 1) : 0

  const gerarPontosLinha = (chave: 'receitas' | 'despesas') =>
    pontos
      .map((item, index) => {
        const x = margemX + index * passo
        const y = altura - margemY - (item[chave] / maximo) * (altura - margemY * 2)
        return `${x},${y}`
      })
      .join(' ')

  const larguraBarra = pontos.length > 0 ? Math.min(18, passo * 0.42) : 0

  return (
    <View style={styles.container}>
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

      {pontos.length > 0 ? (
        <>
          <View style={styles.grafico}>
            <Svg width="100%" height={altura} viewBox={`0 0 ${largura} ${altura}`}>
              <Defs>
                <SvgGradient id="barraGradiente" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={Cores.estado.alerta} />
                  <Stop offset="1" stopColor={Cores.estado.perigo} />
                </SvgGradient>
              </Defs>
              {[0.25, 0.5, 0.75].map(nivel => (
                <Line
                  key={nivel}
                  x1={0}
                  x2={largura}
                  y1={altura - nivel * altura}
                  y2={altura - nivel * altura}
                  stroke={Cores.base.branco}
                  strokeOpacity={0.09}
                  strokeWidth={1}
                />
              ))}
              {pontos.map((item, index) => {
                const x = margemX + index * passo - larguraBarra / 2
                const alturaBarra = (item.receitas / maximo) * (altura - margemY * 2)
                const y = altura - margemY - alturaBarra
                return (
                  <Rect
                    key={item.dia}
                    x={x}
                    y={y}
                    width={larguraBarra}
                    height={alturaBarra}
                    rx={larguraBarra / 2.4}
                    fill="url(#barraGradiente)"
                  />
                )
              })}
              <Polyline
                points={gerarPontosLinha('despesas')}
                fill="none"
                stroke={Cores.texto.principal}
                strokeOpacity={0.6}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <View style={styles.dias}>
              {pontos.map(item => <Text key={item.dia} style={styles.dia}>{item.dia}</Text>)}
            </View>
          </View>

          {onPress && <Text onPress={onPress} style={styles.verMais}>Ver dashboard completo ›</Text>}
        </>
      ) : (
        <View style={styles.vazio}>
          <Text style={styles.vazioTitulo}>Dados de estatísticas ainda não disponíveis</Text>
          <Text style={styles.vazioTexto}>Cadastre seus dados financeiros para visualizar o resumo.</Text>
        </View>
      )}
    </View>
  )
}
