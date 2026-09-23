import type { ReactNode } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { BackgroundGradient } from "./backgroundGradient";

type AuthFormProps = {
  title: string;
  subtitle?: string;
  error?: string;
  header?: ReactNode;
  children: ReactNode;
};

export function AuthForm({
  title,
  subtitle,
  error,
  header,
  children,
}: AuthFormProps) {
  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : "height"
          }
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            {header ?? (
              <>
                <Text style={styles.title}>
                  {title}
                </Text>

                {subtitle ? (
                  <Text style={styles.text}>
                    {subtitle}
                  </Text>
                ) : null}
              </>
            )}

            {error ? (
              <Text
                accessibilityRole="alert"
                style={styles.error}
              >
                {error}
              </Text>
            ) : null}

            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

export const formStyles = StyleSheet.create({
  text: {
    color: "#e8dcfa",
    fontSize: 16,
    lineHeight: 23,
  },

  error: {
    color: "#ffacb8",
    fontSize: 15,
  },

  link: {
    color: "#d3b4ff",
    textAlign: "center",
    padding: 14,
  },

  success: {
    color: "#a7efc1",
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: 18,
    padding: 24,
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Raleway_700Bold",
  },

  text: formStyles.text,
  error: formStyles.error,
});