import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (

    <Stack>
      <Stack.Screen
        name="BemVindo"
        options={{
          title: "Bem-vindo",
        }}
      />

      <Stack.Screen
        name="Trilhe"
        options={{
          title: "Trilhe",
        }}
      />

    </Stack>

  );
}