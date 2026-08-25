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
  obterProximoEvento,
  obterEstatisticasHome,
  obterPlanoBResumo,
  obterPlanejamentoHome,
} from '../../features/dashboard'
import { useFinanceiro } from '../../features/financeiroContext'
import { styles } from '../../styles/paginaInicial'

export default function PaginaInicial() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { salario, despesas, economiaFutura, tempoEconomia } = useFinanceiro()

  const temDadosFinanceiros = salario !== undefined && despesas !== undefined
  const saldoAtual = temDadosFinanceiros ? salario - despesas : undefined
  const economia =
    economiaFutura !== undefined && tempoEconomia !== undefined && tempoEconomia > 0
      ? {
          economiaFutura,
          tempoEconomia,
          economiaMensal: economiaFutura / tempoEconomia,
          percentualMeta: salario && salario > 0 ? (economiaFutura / tempoEconomia / salario) * 100 : 0,
        }
      : undefined

  const evento = obterProximoEvento()
  const estatisticas = obterEstatisticasHome()
  const planoB = obterPlanoBResumo(salario, despesas)
  const planejamento = obterPlanejamentoHome()
  const mesAtual = new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' })

  return (
    <View style={styles.container}>
      <BackgroundGradient />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: insets.top + 6, paddingBottom: 115 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader
          onPremium={() => router.push('/Premium/Premium')}
          onNotificacao={() => router.push('/Notificacao/Notificacao')}
          onPerfil={() => router.push('/perfil')}
        />

        <CardSaldo
          saldoAtual={saldoAtual}
          saldoMes={saldoAtual}
          maximoDisponivel={salario}
          data={temDadosFinanceiros ? mesAtual : undefined}
          onPress={() => router.push('/dashboard')}
        />

        <CardEvento
          evento={evento}
          onPress={() => router.push('/calendario')}
        />

        <GraficoEstatisticas
          dados={estatisticas}
          onPress={() => router.push('/dashboard')}
        />

        <CardPlanob
          dados={planoB}
          onPress={() => router.push('/PlanoB')}
        />

        <CardPlanejamento
          dados={planejamento}
          onPress={() => router.push('/calendario')}
        />

        <CardEconomia
          dados={economia}
          onPress={() => router.push('/configuracaoInicial/FutureSavings')}
        />
      </ScrollView>
    </View>
  )
}
