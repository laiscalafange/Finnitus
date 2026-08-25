import { Text, View } from 'react-native'
import Svg, { Polyline, Line } from 'react-native-svg'
import { EstatisticaResumo } from '../../types'
import { styles } from './styles'

type Props = {
  dados?: EstatisticaResumo[]
  onPress?: () => void
}

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function GraficoEstatisticas({ dados, onPress }: Props) {
  const pontos = dados ?? []
  const maximo = Math.max(...pontos.flatMap(item => [item.receitas, item.despesas]), 1)
  const largura = 260
  const altura = 92
  const margemX = 10
  const margemY = 8
  const passo = pontos.length > 1 ? (largura - margemX * 2) / (pontos.length - 1) : 0

  const gerarPontos = (chave: 'receitas' | 'despesas') =>
    pontos
      .map((item, index) => {
        const x = margemX + index * passo
        const y = altura - margemY - (item[chave] / maximo) * (altura - margemY * 2)
        return `${x},${y}`
      })
      .join(' ')

  const maiorReceita = pontos.reduce((maior, item) => Math.max(maior, item.receitas), 0)
  const maiorDespesa = pontos.reduce((maior, item) => Math.max(maior, item.despesas), 0)

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Estatísticas</Text>
        <Text style={styles.periodo}>Gastos da semana</Text>
      </View>

      {pontos.length > 0 ? (
        <>
          <View style={styles.grafico}>
            <Svg width="100%" height={altura} viewBox={`0 0 ${largura} ${altura}`}>
              {[0.25, 0.5, 0.75].map(nivel => (
                <Line
                  key={nivel}
                  x1={0}
                  x2={largura}
                  y1={altura - nivel * altura}
                  y2={altura - nivel * altura}
                  stroke="#FFFFFF16"
                  strokeWidth={1}
                />
              ))}
              <Polyline
                points={gerarPontos('receitas')}
                fill="none"
                stroke="#B7FF00"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Polyline
                points={gerarPontos('despesas')}
                fill="none"
                stroke="#FF8800"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <View style={styles.dias}>
              {pontos.map(item => <Text key={item.dia} style={styles.dia}>{item.dia}</Text>)}
            </View>
          </View>

          <View style={styles.legenda}>
            <View style={styles.legendaItem}>
              <View style={[styles.ponto, styles.pontoReceita]} />
              <Text style={styles.legendaTexto}>Gastos desta semana {moeda(maiorReceita)}</Text>
            </View>
            <View style={styles.legendaItem}>
              <View style={[styles.ponto, styles.pontoDespesa]} />
              <Text style={styles.legendaTexto}>Gastos da semana passada {moeda(maiorDespesa)}</Text>
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
