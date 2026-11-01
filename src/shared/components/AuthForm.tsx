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
import { BotaoVoltarAuth } from "./BotaoVoltar";

type AuthFormProps = {
  title: string;
  subtitle?: string;
  error?: string;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;

  // topo: campos próximos do título.
  // centro: campos centralizados abaixo do título.
  // mensagem: cabeçalho e conteúdo centralizados juntos.
  layout?: "topo" | "centro" | "mensagem";

  // seta verde de voltar no topo (padrão: aparece)
  mostrarVoltar?: boolean;
};

export function AuthForm({
  title,
  subtitle,
  error,
  header,
  footer,
  children,
  layout = "centro",
  mostrarVoltar = true,
}: AuthFormProps) {
  const cabecalho = (
    <View style={styles.header}>
      {header ?? (
        <>
          <Text style={styles.title}>{title}</Text>

          {subtitle ? (
            <Text style={formStyles.text}>
              {subtitle}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );

  const conteudo = (
    <>
      {error ? (
        <Text
          accessibilityRole="alert"
          style={[formStyles.error, styles.errorSpacing]}
        >
          {error}
        </Text>
      ) : null}

      {children}
    </>
  );

  return (
    <View style={styles.screenBase}>
      {/* Usa o gradiente RADIAL original do Finnitus; não interfere nos toques. */}
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <BackgroundGradient variante="padrao" />
      </View>

      <SafeAreaView style={styles.screen}>
        {mostrarVoltar ? <BotaoVoltarAuth /> : null}

        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.screen}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            {layout === "mensagem" ? (
              <View style={styles.mensagem}>
                {cabecalho}
                {conteudo}
              </View>
            ) : (
              <>
                {cabecalho}

                <View
                  style={[
                    styles.formulario,
                    layout === "topo"
                      ? styles.formularioTopo
                      : styles.formularioCentro,
                  ]}
                >
                  {conteudo}
                </View>
              </>
            )}

            {footer ? (
              <View style={styles.footer}>
                {footer}
              </View>
            ) : null}
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
    marginBottom: 16,
  },
});

const styles = StyleSheet.create({
  screenBase: {
    flex: 1,
    backgroundColor: "#09090B",
  },

  screen: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
  },

  header: {
    flexShrink: 0,
    marginBottom: 12,
  },

  formulario: {
    flexGrow: 1,
    flexShrink: 0,
  },

  formularioTopo: {
    justifyContent: "flex-start",
  },

  formularioCentro: {
    justifyContent: "center",
  },

  mensagem: {
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: "center",
  },

  footer: {
    flexShrink: 0,
    paddingTop: 24,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Raleway_700Bold",
  },

  errorSpacing: {
    marginBottom: 16,
  },
});