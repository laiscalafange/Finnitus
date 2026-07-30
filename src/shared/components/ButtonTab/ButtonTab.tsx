import { TouchableOpacity, Text } from 'react-native'
import { ButtonTabProps } from "./ButtonTabTypes";
import { styles } from './ButtonTabStyles';

export function ButtonTab({
  aoPress,
  icone = "+",
}: ButtonTabProps) {
  return (
    <TouchableOpacity style={styles.botao} onPress={aoPress} activeOpacity={0.8}>
      <Text style={styles.icone}>{icone}</Text>
    </TouchableOpacity>
  )
}