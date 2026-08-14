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

  // Carrega as fontes antes do aplicativo iniciar
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

  // Enquanto as fontes carregam, não renderiza nada
  // (a splash screen fica visível nesse meio tempo)
  if (!fontsLoaded) {
    return null;
  }

  return (
    // Navegação em pilha (Stack)
    <Stack>

      {/* Tela inicial do aplicativo */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      {/* 
  Registra o grupo de rotas de onboarding.
  As telas internas (BemVindo e Trilhe) são gerenciadas pelo
  arquivo app/onboarding/_layout.jsx, portanto não é necessário
  registrá-las individualmente neste Stack principal.
*/}
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />

      {/* Grupo de autenticação */}
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />

      {/* Grupo das abas */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="configuracaoInicial"
        options={{
          headerShown: false,
        }}
      />

    </Stack>
  );
}