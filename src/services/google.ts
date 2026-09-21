import { Platform } from "react-native";
import Constants from "expo-constants";

export async function googleIdToken(): Promise<
  string | null
> {
  if (Platform.OS === "web") {
    throw new Error(
      "O acesso Google desta versão está disponível no aplicativo Android/iOS. Na web, use e-mail e senha."
    );
  }

  if (Constants.appOwnership === "expo") {
    throw new Error(
      "O login Google precisa da versão de desenvolvimento instalada do Finnitus. Use e-mail e senha no Expo Go."
    );
  }

  const webClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  const iosClientId =
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

  if (
    !webClientId ||
    (Platform.OS === "ios" && !iosClientId)
  ) {
    throw new Error(
      "O login Google ainda não foi configurado para este aplicativo."
    );
  }

  const { GoogleSignin } = await import(
    "@react-native-google-signin/google-signin"
  );

  GoogleSignin.configure({
    webClientId,
    ...(iosClientId ? { iosClientId } : {}),
    offlineAccess: false,
  });

  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  const result = await GoogleSignin.signIn();

  if (result.type !== "success") {
    return null;
  }

  if (!result.data.idToken) {
    throw new Error(
      "Google não retornou idToken. Verifique o client ID do tipo Web."
    );
  }

  return result.data.idToken;
}