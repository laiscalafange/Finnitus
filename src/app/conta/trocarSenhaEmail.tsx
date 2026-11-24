import { useState } from "react";
import { useRouter } from "expo-router";

import { useIdioma } from "@/features/idioma";
import { useAuth } from "../../features/authContext";
import { authService } from "../../services/auth";
import { AuthForm } from "../../shared/components/AuthForm";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { useAction } from "../../shared/hooks/useAction";
import { normalizeEmail, validEmail } from "../../shared/utils/formValidation";

export default function TrocarSenhaEmail() {
  const { t } = useIdioma();
  const router = useRouter();
  const { user, startRecovery } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const { busy, error, run } = useAction();

  function enviar() {
    void run(async () => {
      const normalized = normalizeEmail(email);
      if (!validEmail(normalized)) {
        throw new Error(t("Informe um e-mail válido."));
      }

      if (!user || normalized !== normalizeEmail(user.email)) {
        throw new Error(t("Informe o e-mail da sua conta."));
      }

      await authService.forgot(normalized);
      startRecovery(normalized);
      router.push("/conta/trocarSenhaCodigo");
    });
  }

  return (
    <AuthForm
      layout="topo"
      title={t("Trocar senha")}
      subtitle={t("Confirme seu e-mail: vamos enviar um código pra garantir que é você antes de trocar a senha.")}
      error={error}
      voltarPara="/conta/seguranca"
      footer={
        <>
          <Button
            titulo={busy ? t("Enviando...") : t("Enviar código")}
            variante="primario"
            onPress={enviar}
            disabled={busy}
          />

          <Button
            titulo={t("Cancelar")}
            variante="outline"
            disabled={busy}
            onPress={() => router.dismissTo("/conta/seguranca")}
          />
        </>
      }
    >
      <Input
        label={t("E-mail")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!busy}
      />
    </AuthForm>
  );
}
