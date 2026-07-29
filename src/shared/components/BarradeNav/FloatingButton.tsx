import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from './FloatingButtonStyles'

const ABAS = [
  { chave: 'home',         icone: '🏠' },
  { chave: 'planejamento', icone: '📅' },
  { chave: 'fab',          icone: '+' },
  { chave: 'metas',        icone: '🎯' },
  { chave: 'perfil',       icone: '👤' },
]

export function BottomTab({ abaAtiva, aoPress }: {
  abaAtiva: string
  aoPress: (aba: string) => void
}) {
  return (
    <View style={styles.container}>
      {ABAS.map(aba => {

        if (aba.chave === 'fab') {
          return (
            <TouchableOpacity
              key="fab"
              style={styles.fab}
              onPress={() => aoPress('fab')}
            >
              <Text style={styles.fabIcone}>+</Text>
            </TouchableOpacity>
          )
        }

        return (
          <TouchableOpacity
            key={aba.chave}
            style={styles.aba}
            onPress={() => aoPress(aba.chave)}
          >
            <Text style={[
              styles.icone,
              abaAtiva === aba.chave && styles.iconeAtivo
            ]}>
              {aba.icone}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
