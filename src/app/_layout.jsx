import { Stack } from "expo-router";
import { useFonts } from "expo-font";
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
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Mantém a splash screen visível até as fontes carregarem
SplashScreen.preventAutoHideAsync();

// Função principal do layout que define a navegação do aplicativo
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
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
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Enquanto as fontes não carregam, não renderiza nada
  // (a splash screen fica visível nesse meio tempo)
  if (!fontsLoaded) {
    return null;
  }

  return (
    // Inicia a navegação em pilha (Stack)
    <Stack>

      {/* Tela inicial do aplicativo */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Esconde a barra superior
        }}
      />

      {/* Tela de Login */}
      <Stack.Screen
        name="autenticacao/login"
        options={{
          title: "Login", // Título exibido no topo
        }}
      />

      {/* Tela de Cadastro */}
      <Stack.Screen
        name="autenticacao/cadastro"
        options={{
          title: "Cadastro",
        }}
      />

      {/* Tela de Recuperação de Senha */}
      <Stack.Screen
        name="autenticacao/forgotPassword"
        options={{
          title: "Recuperar Senha",
        }}
      />

      {/* Grupo das abas do aplicativo */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false, // Não mostra cabeçalho nas tabs
        }}
      />

    </Stack>
  );
}