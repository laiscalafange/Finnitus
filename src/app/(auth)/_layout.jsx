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

export default function AuthLayout() {

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

    <Stack>
      {/* Tela cadastro */}
      <Stack.Screen
        name="cadastro"
        options={{
          title: "Cadastro",
        }}
      />

      {/* Tela email enviado */}
      <Stack.Screen
        name="emailSent"
        options={{
          title: "Email Enviado",
        }}
      />

      {/* Tela esqueci a senha */}
      <Stack.Screen
        name="forgotPassword"
        options={{
          title: "Esqueci a Senha",
        }}
      />

      {/* Tela login */}
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />

      {/* Grupo de autenticação */}
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />

    </Stack>

  );
}