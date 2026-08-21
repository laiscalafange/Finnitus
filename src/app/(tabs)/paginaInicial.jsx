import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BackgroundGradient } from '../../shared/components/backgroundGradient'
import { DashboardHeader } from '../../features/dashboard/components/DashboardHeader'
import {
  CardSaldo,
  CardEvento,
  GraficoEstatisticas,
  CardPlanob,
  CardPlanejamento,
  CardEconomia,
} from '../../features/dashboard'
import { styles } from '../../styles/paginaInicial'

export default function PaginaInicial() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <View style={styles.container}>
      <BackgroundGradient />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 105 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader
          onPremium={() => router.push('/Premium/Premium')}
          onNotificacao={() => router.push('/Notificacao/Notificacao')}
        />

        {/* Os componentes recebem dados por props. Como essas fontes ainda não
            estão implementadas neste branch, a Home exibe estados vazios em vez
            de inventar valores para o usuário. */}
        <CardSaldo />
        <CardEvento onPress={() => router.push('/calendario')} />
        <GraficoEstatisticas />
        <CardPlanob />
        <CardPlanejamento />
        <CardEconomia />
      </ScrollView>
    </View>
  )
}
