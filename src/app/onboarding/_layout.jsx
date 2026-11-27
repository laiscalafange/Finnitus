import { Stack } from "expo-router";
import { useAuth } from "../../features/authContext";

export default function OnboardingLayout() {
  const { user } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BemVindo" />

      <Stack.Protected guard={Boolean(user)}>
        <Stack.Screen name="Trilhe" />
        <Stack.Screen name="Guiar" />
        <Stack.Screen name="exPlano" />
        <Stack.Screen name="exMetas" />
        <Stack.Screen name="exDashboard" />
        <Stack.Screen name="exCalendario" />
        <Stack.Screen name="exPlanoB" />
      </Stack.Protected>
    </Stack>
  );
}