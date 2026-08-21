import { TouchableOpacity, View } from 'react-native'
import { CalendarDays, House, Plus, Target, User } from 'lucide-react-native'
import { styles } from './FloatingButtonStyles'
import { FloatingButtonProps } from './FloatingButtonTypes'

const ABAS = [
  { chave: 'home', Icone: House },
  { chave: 'planejamento', Icone: CalendarDays },
  { chave: 'fab', Icone: Plus },
  { chave: 'metas', Icone: Target },
  { chave: 'perfil', Icone: User },
] as const

export function FloatingButton({ abaAtiva, aoPress }: FloatingButtonProps) {
  return <View style={styles.container}>
    {ABAS.map(({ chave, Icone }) => {
      const fab = chave === 'fab'
      return <TouchableOpacity key={chave} style={fab ? styles.fab : styles.aba} onPress={() => aoPress(chave)} activeOpacity={.8}>
        <Icone size={fab ? 26 : 22} strokeWidth={fab ? 2.5 : 2} color={fab ? '#B7FF00' : '#FFFFFF'} style={!fab && abaAtiva === chave ? styles.iconeAtivo : styles.icone} />
      </TouchableOpacity>
    })}
  </View>
}
