import { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";

import {
  Redirect,
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Button } from "../../shared/components/Button";
import { FourInput } from "../../shared/components/Four";

import { useAuth } from "../../features/authContext";
import { authService } from "../../services/auth";
import { useAction } from "../../shared/hooks/useAction";

import {
  styles as verificacaoStyles,
} from "../../styles/VerifyEmailStyles";

export default function VerifyEmail() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const trocando = params.modo === "trocar";

  const {
    recoveryEmail,
    setResetToken,
  } = useAuth();

  const [codigo, setCodigo] = useState("");
  const [remaining, setRemaining] = useState(60);
  const [attempt, setAttempt] = useState(0);

  const {
    busy,
    error,
    run,
    clearError,
  } = useAction();

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!recoveryEmail) {
    return (
      <Redirect
        href={{
          pathname: "/forgotPassword",
          params: trocando ? { modo: "trocar" } : {},
        }}
      />
    );
  }

  function validar() {
    void run(async () => {
      if (!/^\d{4}$/.test(codigo)) {
        throw new Error("Informe os quatro dígitos.");
      }

      const result = await authService.verify(
        recoveryEmail,
        codigo
      );

      setResetToken(result.resetToken);

      router.replace({
        pathname: "/resetPassword",
        params: trocando ? { modo: "trocar" } : {},
      });
    });
  }

  function reenviar() {
    void run(async () => {
      await authService.forgot(recoveryEmail);

      setRemaining(60);
      setCodigo("");
      setAttempt((value) => value + 1);
    });
  }

    return (
    <AuthForm
      layout="centro"
      title="Verificação de e-mail"
      error={error}
      header={
        <View>
          <Text
            style={[
              verificacaoStyles.titulo,
              { marginBottom: 12 },
            ]}
          >
            <Text style={verificacaoStyles.tituloDestaque}>
              Verificação
            </Text>
            {" "}de e-mail
          </Text>

          <Text
            style={[
              verificacaoStyles.subtitulo,
              { marginBottom: 20 },
            ]}
          >
            Digite o código de 4 dígitos recebido em{" "}
            <Text style={verificacaoStyles.emailDestaque}>
              {recoveryEmail}
            </Text>
            .
          </Text>
        </View>
      }
      footer={
        <>
          <Button
            titulo={busy ? "Aguarde..." : "Validar código"}
            variante="primario"
            disabled={busy || codigo.length !== 4}
            onPress={validar}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              disabled: busy || remaining > 0,
            }}
            disabled={busy || remaining > 0}
            onPress={reenviar}
            style={({ pressed }) => ({
              alignSelf: "center",
              paddingVertical: 10,
              marginBottom: 16,
              opacity:
                busy || remaining > 0
                  ? 0.5
                  : pressed
                    ? 0.7
                    : 1,
            })}
          >
            <Text
              style={[
                verificacaoStyles.reenviar,
                { marginTop: 0 },
              ]}
            >
              {remaining > 0
                ? `Reenviar em ${remaining}s`
                : "Reenviar código"}
            </Text>
          </Pressable>

          <Button
            titulo="Usar outro e-mail"
            variante="primario"
            disabled={busy}
            onPress={() => {
              router.replace({
                pathname: "/forgotPassword",
                params: trocando ? { modo: "trocar" } : {},
              });
            }}
          />
        </>
      }
    >
      <FourInput
        key={attempt}
        erro={Boolean(error)}
        onCodigoCompleto={(value) => {
          setCodigo(value);
              clearError();
        }}
      />
    </AuthForm>
  );
}
