import { Image, Text, TouchableOpacity, View } from 'react-native'
import { ChevronDown } from 'lucide-react-native'
import { Avatar } from '@/shared/components/Avatar'
import { Cores } from '@/shared/constants/Cores'
import { styles } from './DashboardHeaderStyles'

type Props = {
  // Nome da pessoa (só pra mostrar as iniciais no avatar)
  nome?: string
  // Mês mostrado no centro (ex.: "Outubro")
  mes: string
  aoPressMes?: () => void
  onPremium?: () => void
  onNotificacao?: () => void
  onPerfil?: () => void
}

// Topo da Home: avatar (com a coroa do Premium), mês no centro e sino
export function DashboardHeader({ nome, mes, aoPressMes, onPremium, onNotificacao, onPerfil }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarArea}>
        <TouchableOpacity onPress={onPerfil} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Abrir perfil">
          <Avatar name={nome} size={50} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.coroaBadge} onPress={onPremium} activeOpacity={0.8} accessibilityLabel="Abrir Premium">
          <Image source={require('../../../../assets/icones/coroa.png')} style={styles.coroaIcone} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.mes}
        onPress={aoPressMes}
        disabled={!aoPressMes}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Mês selecionado: ${mes}. Toque para trocar`}
      >
        <Text style={styles.mesTexto} numberOfLines={1}>{mes}</Text>
        <ChevronDown size={22} color={Cores.base.branco} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSino} onPress={onNotificacao} activeOpacity={0.8} accessibilityLabel="Abrir notificações">
        <Image source={require('../../../../assets/icones/sino.png')} style={styles.sinoIcone} />
      </TouchableOpacity>
    </View>
  )
}