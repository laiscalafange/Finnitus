import { Tabs, usePathname, useRouter } from 'expo-router'
import { FloatingButton } from '../../shared/components/BarradeNav'

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

  // Telas que não mostram a barra de navegação (criação de meta e as
  // telas Histórico e Análises de Metas)
  const semBarra = pathname.includes('MetasFuturas')
    || pathname.includes('MetasHistorico')
    || pathname.includes('MetasAnalises')

  function navegar(aba) {
    if (aba === 'home') router.push('/paginaInicial')
    if (aba === 'calendario') router.push('/calendario')
    if (aba === 'metas') router.push('/metas')
    if (aba === 'dashboard') router.push('/dashboard')
    if (aba === 'planoB') router.push('/PlanoB')
    if (aba === 'perfil') router.push('/perfil')

    // Ações do menu que abre ao tocar no + (telas em src/app/mais)
    if (aba === 'novoImprevisto') router.push('/mais/novoImprevisto')
    if (aba === 'novoGasto') router.push('/mais/novoGasto')
    if (aba === 'novoEvento') router.push('/mais/novoEvento')
    if (aba === 'reservaEmergencia') router.push('/mais/reservaEmergencia')
  }

  if (semBarra) return null

  return <FloatingButton abaAtiva={abaAtiva} aoPress={navegar} />
}

export default function TabsLayout() {
  // backBehavior="history": a seta de voltar (router.back) retorna pra tela
  // de onde o usuário veio, em vez de sempre cair na primeira aba
  return <Tabs
    backBehavior="history"
    screenOptions={{ headerShown: false }}
    tabBar={() => <BarraInferior />}
  >
    <Tabs.Screen name="paginaInicial" />
    <Tabs.Screen name="calendario" />
    <Tabs.Screen name="metas" />
    <Tabs.Screen name="perfil" />
    <Tabs.Screen name="dashboard" options={{ href: null }} />
    <Tabs.Screen name="MetasDetalhes" options={{ href: null }} />
    <Tabs.Screen name="MetasFrame" options={{ href: null }} />
    <Tabs.Screen name="MetasFuturas" options={{ href: null }} />
    <Tabs.Screen name="MetasHistorico" options={{ href: null }} />
    <Tabs.Screen name="MetasAnalises" options={{ href: null }} />
  </Tabs>
}