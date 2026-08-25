import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from '@/shared/components/Avatar'
import { styles } from './DashboardHeaderStyles'

type Props = {
  onPremium?: () => void
  onNotificacao?: () => void
  onPerfil?: () => void
}

export function DashboardHeader({ onPremium, onNotificacao, onPerfil }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.identidade} onPress={onPerfil} activeOpacity={0.8}>
        <Avatar size={42} />
        <View>
          <Text style={styles.titulo}>Olá!</Text>
          <Text style={styles.subtitulo}>Seu resumo financeiro</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.icones}>
        <TouchableOpacity onPress={onPremium} activeOpacity={0.75} accessibilityLabel="Abrir Premium">
          <Image source={require('../../../../assets/icones/coroa.png')} style={styles.icone} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNotificacao} activeOpacity={0.75} accessibilityLabel="Abrir notificações">
          <Image source={require('../../../../assets/icones/sino.png')} style={styles.icone} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
