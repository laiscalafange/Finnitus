import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FONTS } from '@/shared/constants/Tipografia'
import { styles } from './styles'

type Props = { saldoAtual?: number; saldoMes?: number }
const moeda = (v?: number) => v === undefined ? 'R$ —' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function CardSaldo({ saldoAtual, saldoMes }: Props) {
  const indisponivel = saldoAtual === undefined && saldoMes === undefined
  return <LinearGradient colors={['#B7FF00','#7CFF00','#B7FF00']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.container}>
    <View style={styles.topo}><Text style={styles.titulo}>Saldo atual</Text><Text style={styles.mes}>mês atual</Text></View>
    <Text style={styles.saldo}>{moeda(saldoAtual)}</Text>
    <View style={styles.divisor}/>
    <Text style={styles.label}>Saldo do mês</Text>
    <Text style={styles.valorMes}>{moeda(saldoMes)}</Text>
    <Text style={styles.observacao}>{indisponivel ? 'Conecte aqui os dados reais da gestão financeira quando essa funcionalidade estiver disponível.' : 'Resumo dos dados financeiros disponíveis.'}</Text>
  </LinearGradient>
}
