import { Stack } from "expo-router";

export default function ConfigInitialLayout() {

  return (

    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FinancialData" />
      <Stack.Screen name="FutureGoals" />
      <Stack.Screen name="FutureSavings" />
      <Stack.Screen name="FutureVision" />
      
    </Stack>

  );
}