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

  function navegar(aba) {
    if (aba === 'home') router.push('/paginaInicial')
    if (aba === 'calendario') router.push('/calendario')
    if (aba === 'metas') router.push('/metas')
    if (aba === 'dashboard') router.push('/dashboard')
    if (aba === 'planoB') router.push('/PlanoB')
    if (aba === 'perfil') router.push('/perfil')
    // FAB permanece visualmente disponível até existir uma ação de lançamento
    // financeiro implementada no projeto.
  }

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
  </Tabs>
}