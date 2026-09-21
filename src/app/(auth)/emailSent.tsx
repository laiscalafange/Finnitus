import { useEffect } from "react";

import {
  Redirect,
  useRouter,
} from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Button } from "../../shared/components/Button";
import { useAuth } from "../../features/authContext";

export default function EmailSent() {
  const router = useRouter();

  const { recoveryEmail } = useAuth();

  useEffect(() => {
    if (!recoveryEmail) {
      return;
    }

    const timer = setTimeout(() => {
      router.replace("/verifyEmail");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [recoveryEmail, router]);

  if (!recoveryEmail) {
    return <Redirect href="/forgotPassword" />;
  }

  return (
    <AuthForm
      title="Confira seu e-mail"
      subtitle="Se a conta existir e o envio for concluído, o código chegará em instantes. Confira também o spam."
    >
      <Button
        titulo="Já tenho o código"
        onPress={() => {
          router.replace("/verifyEmail");
        }}
      />
    </AuthForm>
  );
}