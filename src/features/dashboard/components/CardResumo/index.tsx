import { Text, View } from 'react-native'
import { ArrowDown, ArrowUp } from 'lucide-react-native'
import { Cores } from '@/shared/constants/Cores'
import { styles } from './styles'

type Props = {
  receitas?: number
  despesas?: number
}

const moeda = (valor?: number) =>
  valor === undefined
    ? 'R$ —'
    : valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Receitas e Despesas lado a lado (ficam dentro do header roxo da Home)
export function CardResumo({ receitas, despesas }: Props) {
  return (
    <View style={styles.linha}>
      <View style={styles.item}>
        <View style={[styles.bolha, styles.bolhaReceita]}>
          <ArrowUp size={26} color={Cores.texto.contraste} />
        </View>
        <View style={styles.textos}>
          <Text style={styles.label}>Receitas</Text>
          <Text style={[styles.valor, styles.valorReceita]} numberOfLines={1} adjustsFontSizeToFit>
            {moeda(receitas)}
          </Text>
        </View>
      </View>

      <View style={styles.item}>
        <View style={[styles.bolha, styles.bolhaDespesa]}>
          <ArrowDown size={26} color={Cores.base.branco} />
        </View>
        <View style={styles.textos}>
          <Text style={styles.label}>Despesas</Text>
          <Text style={[styles.valor, styles.valorDespesa]} numberOfLines={1} adjustsFontSizeToFit>
            {moeda(despesas)}
          </Text>
        </View>
      </View>
    </View>
  )
}