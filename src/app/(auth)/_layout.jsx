import { Stack } from "expo-router";

export default function AuthLayout() {

  return (

    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="inicie" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="emailSent" />
      <Stack.Screen name="forgotPassword" />
      <Stack.Screen name="login" />
      <Stack.Screen name="resetPassword" />
      <Stack.Screen name="verifyEmail" />
      <Stack.Screen name="escolha" />
      <Stack.Screen name="voltando" />
    </Stack>

  );
}