import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthBackground } from "./AuthBackground";
import { BotaoVoltarAuth } from "./BotaoVoltar";

type Props = {
  children: ReactNode;
  error?: string | null;
};

/**
 * Um único ScrollView para toda a tela evita que o botão fique escondido.
 * O espaço superior reserva a região da seta de voltar.
 */
export function AuthLayoutCompacto({ children, error }: Props) {
  const { height } = useWindowDimensions();
  const pequeno = height < 760;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#09090B" }}
      edges={["top", "bottom"]}
    >
      <AuthBackground />
      <BotaoVoltarAuth absoluto />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: pequeno ? 104 : 116,
            paddingBottom: pequeno ? 16 : 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {error ? (
            <View
              accessibilityRole="alert"
              style={{
                borderWidth: 1,
                borderColor: "#A85668",
                backgroundColor: "rgba(105, 24, 45, 0.22)",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 9,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#FFD4DD", fontSize: 13 }}>
                {error}
              </Text>
            </View>
          ) : null}

          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
