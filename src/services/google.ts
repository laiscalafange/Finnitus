import { Platform } from "react-native";
import { isRunningInExpoGo } from "expo";

export async function googleIdToken(): Promise<
  string | null
> {
  if (Platform.OS === "web") {
    throw new Error(
      "O acesso Google desta versão está disponível no aplicativo Android/iOS. Na web, use e-mail e senha."
    );
  }

  if (isRunningInExpoGo()) {
    throw new Error(
      "O login com Google precisa do aplicativo Finnitus instalado. No Expo Go, entre com e-mail e senha."
    );
  }

  const webClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();

  const iosClientId =
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();

  if (
    !webClientId ||
    (Platform.OS === "ios" && !iosClientId)
  ) {
    throw new Error(
      "O login Google ainda não foi configurado para este aplicativo."
    );
  }

  const { GoogleSignin, isErrorWithCode, statusCodes } = await import(
    "@react-native-google-signin/google-signin"
  ).catch(() => {
    throw new Error(
      "O login com Google não está disponível nesta instalação do Finnitus. Atualize o aplicativo ou entre com e-mail e senha."
    );
  });

  const playServicesMessage =
    "O login com Google requer o Google Play Services. Atualize-o no seu aparelho e tente novamente.";

  try {
    if (Platform.OS === "android") {
      const playServicesAvailable = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      if (!playServicesAvailable) {
        throw new Error(playServicesMessage);
      }
    }

    GoogleSignin.configure({
      webClientId,
      ...(iosClientId ? { iosClientId } : {}),
      offlineAccess: false,
    });

    const result = await GoogleSignin.signIn();
    if (result.type === "cancelled") {
      return null;
    }

    if (!result.data.idToken) {
      throw new Error(
        "O Google não concluiu a autenticação. Tente novamente ou entre com e-mail e senha."
      );
    }

    return result.data.idToken;
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case "10": // DEVELOPER_ERROR do Google Play Services.
          throw new Error(
            "O login com Google está indisponível nesta versão do Finnitus (erro 10). Entre com e-mail e senha ou contate o suporte."
          );
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          throw new Error(playServicesMessage);
        case statusCodes.IN_PROGRESS:
          throw new Error("Já há um login com Google em andamento.");
      }
    }

    throw error;
  }
}
