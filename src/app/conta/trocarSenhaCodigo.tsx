import { useEffect, useState } from "react";
import { Text } from "react-native";
import { Redirect, useRouter } from "expo-router";

import { useIdioma } from "@/features/idioma";
import { useAuth } from "../../features/authContext";
import { authService } from "../../services/auth";
import { AuthForm } from "../../shared/components/AuthForm";
import { Button } from "../../shared/components/Button";
import { FourInput } from "../../shared/components/Four";
import { useAction } from "../../shared/hooks/useAction";
import { styles } from "../../styles/trocarSenhaCodigo";

export default function TrocarSenhaCodigo() {
  const { t } = useIdioma();
  const router = useRouter();
  const { recoveryEmail, setResetToken } = useAuth();

  const [codigo, setCodigo] = useState("");
  const [remaining, setRemaining] = useState(60);
  const [attempt, setAttempt] = useState(0);
  const { busy, error, run, clearError } = useAction();

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!recoveryEmail) {
    return <Redirect href="/conta/trocarSenhaEmail" />;
  }

  function validar() {
    void run(async () => {
      if (!/^\d{4}$/.test(codigo)) {
        throw new Error(t("Informe os quatro dígitos."));
      }

      const result = await authService.verify(recoveryEmail, codigo);
      setResetToken(result.resetToken);
      router.replace("/conta/redefinirSenha");
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
      title={t("Trocar senha")}
      subtitle={t("Confira o e-mail {email}. O código expira em 15 minutos.", { email: recoveryEmail })}
      error={error}
      voltarPara="/conta/trocarSenhaEmail"
      footer={
        <>
          <Button
            titulo={busy ? t("Aguarde...") : t("Validar código")}
            variante="primario"
            disabled={busy || codigo.length !== 4}
            onPress={validar}
          />

          <Button
            titulo={
              remaining > 0
                ? t("Reenviar em {segundos}s", { segundos: remaining })
                : t("Reenviar código")
            }
            variante="outline"
            disabled={busy || remaining > 0}
            onPress={reenviar}
          />

          <Text style={styles.aviso}>
            {t("A API permite até cinco tentativas por código. Um novo pedido invalida o código anterior.")}
          </Text>

          <Button
            titulo={t("Voltar")}
            variante="outline"
            disabled={busy}
            onPress={() => router.replace("/conta/trocarSenhaEmail")}
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
