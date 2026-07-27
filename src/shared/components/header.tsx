import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GRADIENTS } from '@/shared/constants/Gradientes'

export function Header({ titulo, subtitulo, onNotificacao, onMenu }: {
  titulo: string
  subtitulo?: string
  onNotificacao?: () => void
  onMenu?: () => void
}) {
  return (
    <LinearGradient
      colors={GRADIENTS.header.colors}
      start={GRADIENTS.header.start}
      end={GRADIENTS.header.end}
    >
      <View style={styles.interno}>

        <View>
          <Text style={styles.titulo}>{titulo}</Text>
          {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
        </View>

        <View style={styles.icones}>
          <TouchableOpacity onPress={onNotificacao}>
            <Text style={styles.icone}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onMenu}>
            <Text style={styles.icone}>☰</Text>
          </TouchableOpacity>
        </View>

      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  interno: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#B7FF00',
  },
  subtitulo: {
    fontSize: 13,
    color: '#CA9FFF',
    marginTop: 2,
  },
  icones: {
    flexDirection: 'row',
    gap: 16,
  },
  icone: {
    fontSize: 20,
    color: '#FFFFFF',
  },
})