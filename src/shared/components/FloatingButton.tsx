import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

// os itens do menu
const ABAS = [
  { chave: 'home',     icone: '🏠' },
  { chave: 'planejamento', icone: '📅' },
  { chave: 'fab',      icone: '+' },   // botão central
  { chave: 'metas',    icone: '🎯' },
  { chave: 'perfil',   icone: '👤' },
]

export function BottomTab({ abaAtiva, aoPress }: {
  abaAtiva: string
  aoPress: (aba: string) => void
}) {
  return (
    
    <View style={styles.container}>
      {ABAS.map(aba => {

        // botão central diferente
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

        // abas normais
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#240E47',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    paddingVertical: 12,
    paddingBottom: 24,
  },
  aba: {
    flex: 1,
    alignItems: 'center',
  },
  icone: {
    fontSize: 24,
    opacity: 0.4,
  },
  iconeAtivo: {
    opacity: 1,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#53269D',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    borderWidth: 4,
    borderColor: '#0D1112',
    elevation: 8,
  },
  fabIcone: {
    fontSize: 28,
    color: '#B7FF00',
  },
})