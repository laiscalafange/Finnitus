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
import { useFinanceiro } from '../../features/financeiroContext'
import { METAS_DO_MES } from '../../features/metasData'
import { styles } from '../../styles/paginaInicial'

export default function PaginaInicial() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { salario, despesas, economiaFutura, tempoEconomia } = useFinanceiro()

  const temDadosFinanceiros = salario !== undefined && despesas !== undefined
  const saldo = salario !== undefined && despesas !== undefined ? salario - despesas : undefined
  const economia =
    economiaFutura !== undefined && tempoEconomia !== undefined && tempoEconomia > 0
      ? {
          economiaFutura,
          tempoEconomia,
          economiaMensal: economiaFutura / tempoEconomia,
        }
      : undefined

  const meta = METAS_DO_MES[0]
  const planejamento = meta
    ? {
        titulo: meta.nome,
        valor: `${meta.prazo} • ${meta.valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} de ${meta.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      }
    : undefined

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

        <CardSaldo saldoAtual={saldo} saldoMes={saldo} />
        <CardEvento onPress={() => router.push('/calendario')} />
        <GraficoEstatisticas
          dados={temDadosFinanceiros ? [{ dia: 'Atual', receitas: salario, despesas }] : undefined}
        />
        <CardPlanob />
        <CardPlanejamento dados={planejamento} />
        <CardEconomia dados={economia} />
      </ScrollView>
    </View>
  )
}
