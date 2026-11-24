
import { useEffect } from "react";
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

import {
  SafeAreaProvider,
} from "react-native-safe-area-context";

import {
  ActivityIndicator,
  View,
} from "react-native";
import { Text } from "../shared/components/Texto";

import {
  FinanceiroProvider,
} from "../features/financeiroContext";

import {
  AuthProvider,
  useAuth,
} from "../features/authContext";

import {
  Button,
} from "../shared/components/Button";

import { ConfiguracoesProvider, useConfiguracoes } from "../features/configuracoesContext";
import { NotificacoesProvider } from "../features/contas/useNotificacoes";

// Mantém a splash screen enquanto as fontes carregam.
SplashScreen.preventAutoHideAsync().catch(
  (error) => {
    console.warn(
      "Erro ao configurar splash screen:",
      error
    );
  }
);

// =====================================================
// LAYOUT PRINCIPAL DO FINNITUS
// =====================================================

export default function RootLayout() {

  // 1. CARREGAMENTO DAS FONTES

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

  // 2. CONTROLE DA SPLASH SCREEN

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(
        (error) => {
          console.warn(
            "Erro ao esconder splash screen:",
            error
          );
        }
      );
    }
  }, [fontsLoaded, fontError]);

  // 3. AGUARDA O CARREGAMENTO DAS FONTES

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 4. PROVIDERS DO APLICATIVO

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SessionNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// =====================================================
// NAVEGAÇÃO E AUTENTICAÇÃO
// =====================================================

function SessionNavigator() {
  const {
    user,
    loading,
    startupError,
    retry,
    clearSession,
  } = useAuth();

  // AGUARDANDO AUTENTICAÇÃO

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#160B24",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#d3b4ff"
        />
      </View>
    );
  }

  // ERRO AO RECUPERAR SESSÃO

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
        <Text style={{ color: "#FFFFFF" }}>
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
    <ConfiguracoesProvider key={user?.id ?? "guest"} usuarioId={user?.id}>
      <NavegacaoProtegida user={user} />
    </ConfiguracoesProvider>
  );
}

function NavegacaoProtegida({ user }) {
  const { revisaoFinanceira } = useConfiguracoes();
  return (
    <NotificacoesProvider key={revisaoFinanceira} usuarioId={user?.id}>
      <FinanceiroProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="legal/[doc]" />

        {/* Rotas sem autenticação */}

        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        {/* Rotas autenticadas */}

        <Stack.Protected guard={Boolean(user)}>
          <Stack.Screen name="(tabs)" />

          <Stack.Screen name="onboarding" />

          <Stack.Screen name="configuracaoInicial" />

          <Stack.Screen name="conta" />

          <Stack.Screen name="Premium/Premium" />
          <Stack.Screen name="Premium/Pagamento" />
          <Stack.Screen name="Premium/PremiumAtivo" />

          <Stack.Screen name="Notificacao/Notificacao" />
        </Stack.Protected>
      </Stack>
      </FinanceiroProvider>
    </NotificacoesProvider>
  );
}
