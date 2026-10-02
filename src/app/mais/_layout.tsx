import { Stack } from "expo-router";

// Telas abertas pelo botão "+" da barra de navegação
// (Novo imprevisto, Novo gasto, Novo evento e Reserva de emergência).
// Ficam fora do (tabs), então não mostram a barra de navegação.
export default function MaisLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}