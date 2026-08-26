import { ScrollView, View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
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
import { Cores } from '../../shared/constants/Cores'

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
        contentContainerStyle={{ paddingBottom: 118 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <LinearGradient
          colors={[Cores.fundo.destaque, Cores.fundo.card, Cores.roxo.escuro]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 2 }]}
        >
          <DashboardHeader
            onPremium={() => router.push('/Premium/Premium')}
            onNotificacao={() => router.push('/Notificacao/Notificacao')}
            onPerfil={() => router.push('/perfil')}
          />

          <CardSaldo
            saldoAtual={saldoAtual}
            saldoMes={temDadosFinanceiros ? saldoAtual : undefined}
            maximoDisponivel={salario}
            data={temDadosFinanceiros ? mesAtual : undefined}
            onPress={() => router.push('/dashboard')}
          />

          <View style={styles.heroCurva} pointerEvents="none">
            <View style={styles.heroCurvaForma}>
              <Text style={styles.heroCurvaSeta}>⌄</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.conteudo}>
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
        </View>
      </ScrollView>
    </View>
  )
}
