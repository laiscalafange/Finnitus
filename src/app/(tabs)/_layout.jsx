import { Tabs, usePathname, useRouter } from 'expo-router'
import { FloatingButton } from '../../shared/components/BarradeNav'

function BarraInferior() {
  const router = useRouter()
  const pathname = usePathname()
  const abaAtiva = pathname.includes('paginaInicial') ? 'home'
    : pathname.includes('calendario') ? 'planejamento'
    : pathname.includes('metas') ? 'metas'
    : pathname.includes('perfil') ? 'perfil'
    : 'home'

  function navegar(aba) {
    if (aba === 'home') router.push('/paginaInicial')
    if (aba === 'planejamento') router.push('/calendario')
    if (aba === 'metas') router.push('/metas')
    if (aba === 'perfil') router.push('/perfil')
    // FAB permanece visualmente disponível até existir uma ação de lançamento
    // financeiro implementada no projeto.
  }

  return <FloatingButton abaAtiva={abaAtiva} aoPress={navegar} />
}

export default function TabsLayout() {
  return <Tabs screenOptions={{ headerShown: false }} tabBar={() => <BarraInferior />}>
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
