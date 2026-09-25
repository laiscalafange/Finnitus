import {
  useEffect,
  useState,
} from "react";

import { Text } from "react-native";

import {
  Redirect,
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import {
  AuthForm,
  formStyles,
} from "../../shared/components/AuthForm";

import { Button } from "../../shared/components/Button";
import { FourInput } from "../../shared/components/Four";

import { useAuth } from "../../features/authContext";
import { authService } from "../../services/auth";
import { useAction } from "../../shared/hooks/useAction";

export default function VerifyEmail() {
  const router = useRouter();

  const {
    recoveryEmail,
    setResetToken,
  } = useAuth();

  const params = useLocalSearchParams();
  const trocando = params.modo === "trocar";

  const [codigo, setCodigo] = useState("");
  const [remaining, setRemaining] = useState(60);
  const [attempt, setAttempt] = useState(0);

  const {
    busy,
    error,
    run,
    setError,
  } = useAction();

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((value) =>
        Math.max(0, value - 1)
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
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
        throw new Error(
          "Informe os quatro dígitos."
        );
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
      title="Código de recuperação"
      subtitle={
        `Confira o e-mail ${recoveryEmail}. ` +
        "O código expira em 15 minutos."
      }
      error={error}
    >
      <FourInput
        key={attempt}
        erro={Boolean(error)}
        onCodigoCompleto={(value) => {
          setCodigo(value);
          setError("");
        }}
      />

      <Button
        titulo={
          busy
            ? "Aguarde..."
            : "Validar código"
        }
        disabled={
          busy || codigo.length !== 4
        }
        onPress={validar}
      />

      <Button
        titulo={
          remaining > 0
            ? `Reenviar em ${remaining}s`
            : "Reenviar código"
        }
        variante="outline"
        disabled={busy || remaining > 0}
        onPress={reenviar}
      />

      <Text style={formStyles.text}>
        A API permite até cinco tentativas por código.
        Um novo pedido invalida o código anterior.
      </Text>

      <Button
        titulo="Usar outro e-mail"
        variante="outline"
        disabled={busy}
        onPress={() => {
          router.replace({
            pathname: "/forgotPassword",
            params: trocando ? { modo: "trocar" } : {},
          });
        }}
      />
    </AuthForm>
  );
}