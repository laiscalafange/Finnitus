import { useState } from "react";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { authService } from "../../services/auth";
import { useAuth } from "../../features/authContext";
import { useAction } from "../../shared/hooks/useAction";

import {
  normalizeEmail,
  validEmail,
} from "../../shared/utils/formValidation";

export default function ForgotPassword() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    email?: string;
  }>();

  const [email, setEmail] = useState(
    typeof params.email === "string"
      ? params.email
      : ""
  );

  const { startRecovery } = useAuth();

  const {
    busy,
    error,
    run,
  } = useAction();

  function enviar() {
    void run(async () => {
      const normalized = normalizeEmail(email);

      if (!validEmail(normalized)) {
        throw new Error(
          "Informe um e-mail válido."
        );
      }

      await authService.forgot(normalized);

      startRecovery(normalized);

      router.push("/emailSent");
    });
  }

  return (
    <AuthForm
      title="Recuperar senha"
      subtitle="Se a conta existir, enviaremos um código para o e-mail informado."
      error={error}
    >
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!busy}
      />

      <Button
        titulo={
          busy
            ? "Enviando..."
            : "Enviar código"
        }
        disabled={busy}
        onPress={enviar}
      />

      <Button
        titulo="Voltar ao login"
        variante="outline"
        disabled={busy}
        onPress={() => router.replace("/login")}
      />
    </AuthForm>
  );
}