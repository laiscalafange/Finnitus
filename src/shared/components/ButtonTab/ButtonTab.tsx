import { TouchableOpacity, Text } from 'react-native'
import { styles } from './ButtonTabStyles'

export function FloatingButton({ aoPress, icone = '+' }: {
  aoPress: () => void
  icone?: string
}) {
  return (
    <TouchableOpacity style={styles.botao} onPress={aoPress} activeOpacity={0.8}>
      <Text style={styles.icone}>{icone}</Text>
    </TouchableOpacity>
  )
}