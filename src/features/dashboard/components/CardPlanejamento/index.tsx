import { Text, TouchableOpacity, View } from 'react-native'
import { PlanejamentoResumo } from '../../types'
import { styles } from './styles'

type Props = {
  dados?: PlanejamentoResumo
  onPress?: () => void
}

export function CardPlanejamento({ dados, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Planejamento</Text>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.85}
      >
        <View style={styles.icone}>
          <Text style={styles.iconeTexto}>🎁</Text>
        </View>
        <View style={styles.textos}>
          <Text style={styles.nome}>{dados?.titulo ?? 'Sem planejamento'}</Text>
          <Text style={styles.valor}>{dados?.valor ?? 'Crie uma meta para acompanhar seu progresso.'}</Text>
        </View>
        {dados && <Text style={styles.seta}>›</Text>}
      </TouchableOpacity>
    </View>
  )
}
