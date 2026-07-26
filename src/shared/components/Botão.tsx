import { Pressable, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'  

export function Button({ titulo, variante = 'primario' }: {
  titulo: string
  variante?: 'primario' | 'outline'
}) {
  const isPrimario = variante === 'primario'

  return (
    <Pressable
      style={({ pressed }) => [
        pressed && { opacity: 0.8 }
      ]}
    >
      {/* gradiente do botão */}
      <LinearGradient
        colors={
          isPrimario
            ? ['#482287', '#7E3BED']
            : ['transparent', 'transparent']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.botaoBase,
          styles[variante]
        ]}
      >
        <Text style={[styles.textoBase, styles[`${variante}`]]}>
          {titulo}
        </Text>
      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  // base
  botaoBase: {
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 399,
    height: 49,
  },

  textoBase: {
    fontWeight: '700',
    fontSize: 15,
  },

  // variantes
  primario: {},

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#7E3BED'
  },

  // texto
  texto_primario: { color: '#B7FF00' },
  texto_outline: { color: '#7E3BED' },
})