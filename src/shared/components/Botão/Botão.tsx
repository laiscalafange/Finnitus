import { Pressable, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Cores } from '../../constants/Cores'
import { styles } from './Botão.styles'

export function Button({ titulo, variante = 'primario', onPress }: {
  titulo: string
  variante?: 'primario' | 'outline'
  onPress?: () => void
}) {
  const isPrimario = variante === 'primario'

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && { opacity: 0.8 }]}
    >
      <LinearGradient
        colors={isPrimario ? ['#482287', '#7E3BED'] : ['transparent', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.botaoBase, !isPrimario && styles.outline]}
      >
        <Text style={[
          styles.textoBase,
          { color: isPrimario ? Cores.destaque.limao : Cores.roxo.claro }
        ]}>
          {titulo}
        </Text>
      </LinearGradient>
    </Pressable>
  )
}