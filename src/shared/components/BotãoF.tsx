import { TouchableOpacity, Text, StyleSheet } from 'react-native'

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

const styles = StyleSheet.create({
  botao: {
    position: 'absolute',
    bottom: 88,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#53269D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#53269D',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  icone: {
    fontSize: 30,
    color: '#B7FF00',
    lineHeight: 34,
  },
})