import { Tabs } from "expo-router";

export default function TabsLayout() {

  return (

    <Tabs>

      {/* Aba Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />

      {/* Aba Calendário */}
      <Tabs.Screen
        name="calendario"
        options={{
          title: "Calendário",
        }}
      />

      {/* Aba Metas */}
      <Tabs.Screen
        name="metas"
        options={{
          title: "Metas",
        }}
      />

      {/* Aba Perfil */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
        }}
      />

    </Tabs>

  );
}