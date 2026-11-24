module.exports = ({ config }) => {
  const plugins = [
    ...(config.plugins ?? []),
    "expo-secure-store",
  ];

  const googleEnabled = Boolean(
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
  );

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

    plugins,

    android: {
      ...config.android,

      package:
        process.env.ANDROID_PACKAGE ||
        "com.finnitus.app",
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