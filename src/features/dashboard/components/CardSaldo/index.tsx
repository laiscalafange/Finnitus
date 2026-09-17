import { Image, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { styles, extraStyles } from './styles'
import { Cores } from '@/shared/constants/Cores'

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
        colors={[Cores.destaque.limao, Cores.destaque.limao]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.topo}>
          <View>
            <Text style={styles.titulo}>Saldo</Text>
            <View style={extraStyles.valorComIcone}>
              <Text style={styles.saldo}>{moeda(saldoAtual)}</Text>
              <Image source={require('../../../../../assets/icones/olho.png')} style={extraStyles.olho} />
            </View>
          </View>
          <Text style={styles.mes}>{data ?? 'mês atual'}</Text>
        </View>

        <View style={styles.linhaVariacao}>
          <Text style={styles.label}>última semana</Text>
          <Variacao valor={variacaoSemana} />
        </View>

        <View style={styles.divisor} />

        <Text style={styles.titulo}>Saldo do mês</Text>
        <View style={extraStyles.valorComIcone}>
          <Text style={styles.valorMes}>{moeda(saldoMes)}</Text>
          <Image source={require('../../../../../assets/icones/olho.png')} style={extraStyles.olhoMes} />
        </View>

 <View style={styles.linhaVariacao}>
          <Text style={styles.label}>último mês</Text>
          <Variacao valor={variacaoSemana} />
        </View>
       
      </LinearGradient>
    </TouchableOpacity>
  )
}
