import { Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { styles } from './styles'

type Props = {
  saldoAtual?: number
  saldoMes?: number
  maximoDisponivel?: number
  data?: string
  variacaoSemana?: number
  variacaoMes?: number
  onPress?: () => void
}

const moeda = (valor?: number) =>
  valor === undefined
    ? 'R$ —'
    : valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function Variacao({ valor }: { valor?: number }) {
  if (valor === undefined) return null
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeTexto}>{valor >= 0 ? '↑' : '↓'} {Math.abs(valor)}%</Text>
    </View>
  )
}

export function CardSaldo({
  saldoAtual,
  saldoMes,
  maximoDisponivel,
  data,
  variacaoSemana,
  variacaoMes,
  onPress,
}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} disabled={!onPress}>
      <LinearGradient
        colors={['#B7FF00', '#9EFF00', '#C8FF19']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.topo}>
          <View>
            <Text style={styles.titulo}>Saldo atual</Text>
            <Text style={styles.saldo}>{moeda(saldoAtual)}</Text>
          </View>
          <Text style={styles.mes}>{data ?? 'mês atual'}</Text>
        </View>

        <View style={styles.linhaVariacao}>
          <Text style={styles.label}>última semana</Text>
          <Variacao valor={variacaoSemana} />
        </View>

        <View style={styles.divisor} />

        <Text style={styles.label}>Saldo do mês</Text>
        <Text style={styles.valorMes}>{moeda(saldoMes)}</Text>

        <View style={styles.linhaVariacao}>
          <Text style={styles.label}>máximo disponível</Text>
          <Text style={styles.maximo}>{moeda(maximoDisponivel)}</Text>
        </View>

        <View style={styles.linhaVariacao}>
          <Text style={styles.label}>último mês</Text>
          <Variacao valor={variacaoMes} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}
