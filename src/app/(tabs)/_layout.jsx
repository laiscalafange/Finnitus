import { Tabs, usePathname, useRouter } from 'expo-router'
import { FloatingButton } from '../../shared/components/BarradeNav'
import { Rotas } from '../../shared/constants/Rotas'

function BarraInferior() {
  const router = useRouter()
  const pathname = usePathname()

  const abaAtiva = pathname.includes('paginaInicial') ? 'home'
    : pathname.includes('calendario') ? 'calendario'
    : pathname.includes('metas') ? 'metas'
    : pathname.includes('PlanoB') ? 'planoB'
    : pathname.includes('dashboard') ? 'dashboard'
    : pathname.includes('perfil') ? 'perfil'
    : 'home'

  const semBarra = pathname.includes('MetasFuturas')
    || pathname.includes('MetasHistorico')
    || pathname.includes('MetasAnalises')

  function navegar(aba) {
    switch (aba) {
      case 'home':
        router.push(Rotas.inicio)
        break

      case 'calendario':
        router.push('/calendario')
        break

      case 'metas':
        router.push('/metas')
        break

      case 'dashboard':
        router.push(Rotas.dashboard)
        break

      case 'planoB':
        router.push(Rotas.planoB)
        break

      case 'perfil':
        router.push('/perfil')
        break

      case 'novaReceita':
        router.push({
          pathname: '/mais/novoGasto',
          params: { tipo: 'entrada' },
        })
        break

      case 'novaDespesa':
        router.push({
          pathname: '/mais/novoGasto',
          params: { tipo: 'gasto' },
        })
        break

      case 'novoEvento':
        router.push('/mais/novoEvento')
        break

      case 'reservaEmergencia':
        router.push('/mais/reservaEmergencia')
        break
    }
  }

  if (semBarra) return null

  return (
    <FloatingButton
      abaAtiva={abaAtiva}
      aoPress={navegar}
    />
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => <BarraInferior />}
    >
      <Tabs.Screen name="paginaInicial" />
      <Tabs.Screen name="calendario" />
      <Tabs.Screen name="metas" />
      <Tabs.Screen name="perfil" />

      <Tabs.Screen name="dashboard" />

      <Tabs.Screen name="PlanoB" />

      <Tabs.Screen name="MetasDetalhes" options={{ href: null }} />
      <Tabs.Screen name="MetasFrame" options={{ href: null }} />
      <Tabs.Screen name="MetasFuturas" options={{ href: null }} />
      <Tabs.Screen name="MetasHistorico" options={{ href: null }} />
      <Tabs.Screen name="MetasAnalises" options={{ href: null }} />
    </Tabs>
  )
}