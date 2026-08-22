import { Text, View } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'
import { EconomiaResumo } from '../../types'
import { styles } from './styles'

type Props = { dados?: EconomiaResumo }
const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function CardEconomia({ dados }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Economia mensal</Text>
      <View style={styles.card}>
        <View style={styles.medidor}>
          <View style={styles.medidorInterno}>
            <Text style={styles.percentual}>{dados ? moeda(dados.economiaMensal) : '—'}</Text>
          </View>
        </View>
        <View style={styles.textos}>
          <Text style={styles.destaque}>{dados ? 'Meta de economia' : 'Dados não disponíveis'}</Text>
          <Text style={styles.descricao}>
            {dados
              ? `Para alcançar ${moeda(dados.economiaFutura)} em ${dados.tempoEconomia} ${dados.tempoEconomia === 1 ? 'mês' : 'meses'}, você precisa economizar ${moeda(dados.economiaMensal)} por mês.`
              : 'Cadastre sua economia futura e o tempo estimado para calcular a economia mensal necessária.'}
          </Text>
        </View>
      </View>
    </View>
  )
}
