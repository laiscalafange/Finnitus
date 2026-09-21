import { useEffect } from "react";

import {
  ActivityIndicator,
  View,
  Text,
} from "react-native";

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import {
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
} from "@expo-google-fonts/raleway";

import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { FinanceiroProvider } from "../features/financeiroContext";

import {
  AuthProvider,
  useAuth,
} from "../features/authContext";

import { Button } from "../shared/components/Button";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SessionNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function SessionNavigator() {
  const {
    user,
    loading,
    startupError,
    retry,
    clearSession,
  } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#160B24",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#d3b4ff"
        />
      </View>
    );
  }

  if (startupError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#160B24",
          justifyContent: "center",
          padding: 24,
          gap: 20,
        }}
      >
        <Text style={{ color: "white" }}>
          {startupError}
        </Text>

        <Button
          titulo="Tentar novamente"
          onPress={() => void retry()}
        />

        <Button
          titulo="Sair deste aparelho"
          variante="outline"
          onPress={() => void clearSession()}
        />
      </View>
    );
  }

  return (
    <FinanceiroProvider key={user?.id ?? "guest"}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={Boolean(user)}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="configuracaoInicial" />
          <Stack.Screen name="conta" />

          <Stack.Screen name="Premium/Premium" />
          <Stack.Screen name="Notificacao/Notificacao" />

          <Stack.Screen
            name="Notifica#U00e7#U00e3o/Notificacao"
          />
        </Stack.Protected>
      </Stack>
    </FinanceiroProvider>
  );
}