const { expo } = require("./app.json");

module.exports = () => {
  const plugins = [...(expo.plugins ?? []), "expo-secure-store"];

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

  if (googleEnabled && process.env.GOOGLE_IOS_URL_SCHEME) {
    plugins.push([
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: process.env.GOOGLE_IOS_URL_SCHEME,
      },
    ]);
  }

  return {
    ...expo,
    plugins,

    android: {
      ...expo.android,

      ...(process.env.ANDROID_PACKAGE
        ? { package: process.env.ANDROID_PACKAGE }
        : {}),
    },

    ios: {
      ...expo.ios,

      ...(process.env.IOS_BUNDLE_IDENTIFIER
        ? { bundleIdentifier: process.env.IOS_BUNDLE_IDENTIFIER }
        : {}),
    },
  };
};