module.exports = ({ config }) => {
  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const isAndroidRelease = process.env.EAS_BUILD_PLATFORM === "android" &&
    ["preview", "production", "release"].includes(process.env.EAS_BUILD_PROFILE);

  if (isAndroidRelease) {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim() ?? "";
    if (!/^https:\/\//i.test(apiUrl) || !URL.canParse(apiUrl)) {
      throw new Error("Configure uma URL HTTPS em EXPO_PUBLIC_API_URL para o build Android.");
    }
    if (!googleWebClientId?.endsWith(".apps.googleusercontent.com")) {
      throw new Error("Configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID para o build Android.");
    }
  }

  const plugins = [
    ...(config.plugins ?? []),
    "expo-secure-store",
  ];

  const googleEnabled = Boolean(googleWebClientId);

  if (
    googleEnabled &&
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID &&
    !process.env.GOOGLE_IOS_URL_SCHEME
  ) {
    throw new Error(
      "Preencha GOOGLE_IOS_URL_SCHEME para habilitar Google no iOS."
    );
  }

  if (googleEnabled) {
    if (process.env.GOOGLE_IOS_URL_SCHEME) {
      plugins.push([
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            process.env.GOOGLE_IOS_URL_SCHEME,
        },
      ]);
    } else {
      plugins.push(
        "@react-native-google-signin/google-signin"
      );
    }
  }

  return {
    ...config,

    owner: "laiscalafange",

    // Ícone principal do aplicativo
    icon: "./assets/logo/logo.png",

    plugins,

    android: {
      ...config.android,

      package:
        process.env.ANDROID_PACKAGE ||
        "com.finnitus.app",

      // Ícone adaptativo do Android
      adaptiveIcon: {
        foregroundImage: "./assets/logo/logo.png",
        backgroundColor: "#FFFFFF",
      },
    },

    ios: {
      ...config.ios,

      ...(process.env.IOS_BUNDLE_IDENTIFIER
        ? {
            bundleIdentifier:
              process.env.IOS_BUNDLE_IDENTIFIER,
          }
        : {}),
    },

    extra: {
      ...config.extra,

      eas: {
        ...config.extra?.eas,
        projectId: "6993d975-595c-460f-949b-5a9d636a8d62",
      },
    },
  };
};