import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BemVindo" />
      <Stack.Screen name="Trilhe" />
      <Stack.Screen name="Conheca" />
      <Stack.Screen name="Guiar" />
    </Stack>
  );
}