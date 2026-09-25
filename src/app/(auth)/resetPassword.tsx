import { useState } from "react";

import {
  Redirect,
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { useAuth } from "../../features/authContext";
import { authService } from "../../services/auth";
import { useAction } from "../../shared/hooks/useAction";

import { validatePassword } from "../../shared/utils/formValidation";

export default function ResetPassword() {
  const router = useRouter();

  const {
    resetToken,
    clearRecovery,
  } = useAuth();

  const params = useLocalSearchParams<{ modo?: string }>();
  const trocando = params.modo === "trocar";

  const [complete, setComplete] = useState(false);

  const [senha, setSenha] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const {
    busy,
    error,
    run,
  } = useAction();

  if (complete) {
    // Trocando a senha já logada: volta pra Segurança em vez de
    // mandar pro login (a sessão atual continua valendo).
    if (trocando) {
      return <Redirect href="/conta/seguranca" />;
    }

    return (
      <Redirect
        href={{
          pathname: "/login",
          params: {
            redefinida: "1",
          },
        }}
      />
    );
  }

  if (!resetToken) {
    return (
      <Redirect
        href={{
          pathname: "/forgotPassword",
          params: trocando ? { modo: "trocar" } : {},
        }}
      />
    );
  }

  function reset() {
    void run(async () => {
      validatePassword(senha, confirmation);

      if (!resetToken) {
        throw new Error(
          "Solicite um novo código de recuperação."
        );
      }

      await authService.reset(
        resetToken,
        senha
      );

      setComplete(true);
      clearRecovery();
    });
  }

  return (
    <AuthForm
      title="Nova senha"
      subtitle="Use pelo menos 8 caracteres."
      error={error}
    >
      <Input
        label="Nova senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        editable={!busy}
      />

      <Input
        label="Confirme a senha"
        secureTextEntry
        value={confirmation}
        onChangeText={setConfirmation}
        editable={!busy}
      />

      <Button
        titulo={
          busy
            ? "Salvando..."
            : "Salvar senha"
        }
        disabled={busy}
        onPress={reset}
      />

      <Button
        titulo="Solicitar outro código"
        variante="outline"
        disabled={busy}
        onPress={() => {
          clearRecovery();
          router.replace({
            pathname: "/forgotPassword",
            params: trocando ? { modo: "trocar" } : {},
          });
        }}
      />
    </AuthForm>
  );
}