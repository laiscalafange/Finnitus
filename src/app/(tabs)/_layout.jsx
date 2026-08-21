import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Paginainicial" />
      <Tabs.Screen name="calendario" />
      <Tabs.Screen name="metas" />
      <Tabs.Screen name="paginaInicial" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}