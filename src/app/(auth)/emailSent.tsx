import { useEffect } from "react";

import {
  Redirect,
  useRouter,
} from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Button } from "../../shared/components/Button";
import { useAuth } from "../../features/authContext";
import { useLocalSearchParams } from "expo-router";

export default function EmailSent() {
  const router = useRouter();

  const { recoveryEmail } = useAuth();

  const params = useLocalSearchParams<{ modo?: string }>();
  const trocando = params.modo === "trocar";

  useEffect(() => {
    if (!recoveryEmail) {
      return;
    }

    const timer = setTimeout(() => {
      router.replace({
        pathname: "/verifyEmail",
        params: trocando ? { modo: "trocar" } : {},
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [recoveryEmail, router]);

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

  return (
    <AuthForm
      title="Confira seu e-mail"
      subtitle="Se a conta existir e o envio for concluído, o código chegará em instantes. Confira também o spam."
    >
      <Button
        titulo="Já tenho o código"
        onPress={() => {
          router.replace({
            pathname: "/verifyEmail",
            params: trocando ? { modo: "trocar" } : {},
          });
        }}
      />
    </AuthForm>
  );
}