import { Image, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { styles, extraStyles } from './styles'

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
  const positivo = valor >= 0
  return (
    <View style={[styles.badge, positivo ? styles.badgePositivo : styles.badgeNegativo]}>
      <Text style={[styles.badgeTexto, positivo ? styles.badgeTextoPositivo : styles.badgeTextoNegativo]}>
        {positivo ? '↑' : '↓'} {Math.abs(valor)}%
      </Text>
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
            <View style={extraStyles.valorComIcone}><Text style={styles.saldo}>{moeda(saldoAtual)}</Text><Image source={require('../../../../../assets/icones/olho.png')} style={extraStyles.olho} /></View>
          </View>
          <Text style={styles.mes}>{data ?? 'mês atual'}</Text>
        </View>

        <View style={styles.linhaVariacao}>
          <Text style={styles.label}>última semana</Text>
          <Variacao valor={variacaoSemana} />
        </View>

        <View style={styles.divisor} />

        <Text style={styles.label}>Saldo do mês</Text>
        <View style={extraStyles.valorComIcone}><Text style={styles.valorMes}>{moeda(saldoMes)}</Text><Image source={require('../../../../../assets/icones/olho.png')} style={extraStyles.olhoMes} /></View>

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
