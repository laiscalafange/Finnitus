import { TouchableOpacity, View } from 'react-native'
import { ArrowDown, ArrowUp, ChevronRight } from 'lucide-react-native'
import { Cores } from '@/shared/constants/Cores'
import { Text } from '@/shared/components/Texto'
import { useExibirValores } from '@/features/configuracoesContext'
import { styles } from './styles'

type Props = {
  receitas?: number
  despesas?: number
  // Tocar em Receitas ou Despesas abre a tela Movimentações
  onPressReceitas?: () => void
  onPressDespesas?: () => void
}

// Sem valor preenchido, mostra R$ 0,00 (nunca traços). Valor real não é alterado.
const moeda = (valor?: number) =>
  (valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Receitas e Despesas lado a lado (ficam dentro do header roxo da Home)
export function CardResumo({ receitas, despesas, onPressReceitas, onPressDespesas }: Props) {
  const exibir = useExibirValores()
  return (
    <View style={styles.linha}>
      <TouchableOpacity
        style={styles.item}
        onPress={onPressReceitas}
        disabled={!onPressReceitas}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Ver movimentações de receitas"
      >
        <View style={[styles.bolha, styles.bolhaReceita]}>
          <ArrowUp size={26} color={Cores.texto.contraste} />
        </View>
        <View style={styles.textos}>
          <View style={styles.rotuloLinha}>
            <Text style={styles.label}>Receitas</Text>
            {onPressReceitas && <ChevronRight size={16} color={Cores.texto.claro} />}
          </View>
          <Text style={[styles.valor, styles.valorReceita]} numberOfLines={1} adjustsFontSizeToFit>
            {exibir(moeda(receitas))}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={onPressDespesas}
        disabled={!onPressDespesas}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Ver movimentações de despesas"
      >
        <View style={[styles.bolha, styles.bolhaDespesa]}>
          <ArrowDown size={26} color={Cores.base.branco} />
        </View>
        <View style={styles.textos}>
          <View style={styles.rotuloLinha}>
            <Text style={styles.label}>Despesas</Text>
            {onPressDespesas && <ChevronRight size={16} color={Cores.texto.claro} />}
          </View>
          <Text style={[styles.valor, styles.valorDespesa]} numberOfLines={1} adjustsFontSizeToFit>
            {exibir(moeda(despesas))}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
