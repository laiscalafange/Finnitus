import { useState } from "react";
import { Redirect } from "expo-router";

import { useIdioma } from "@/features/idioma";
import { useAuth } from "../../features/authContext";
import { authService } from "../../services/auth";
import { AuthForm } from "../../shared/components/AuthForm";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { useAction } from "../../shared/hooks/useAction";
import { validatePassword } from "../../shared/utils/formValidation";

export default function RedefinirSenha() {
  const { t } = useIdioma();
  const { resetToken, clearSession, senhaRedefinida } = useAuth();

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const { busy, error, run } = useAction();

  if (senhaRedefinida) {
    return null;
  }

  if (!resetToken) {
    return <Redirect href="/conta/trocarSenhaEmail" />;
  }

  const token = resetToken;
  function salvar() {
    void run(async () => {
      validatePassword(senha, confirmacao);
      await authService.reset(token, senha);
      await clearSession({ senhaRedefinida: true });
    });
  }

  return (
    <AuthForm
      layout="topo"
      title={t("Redefinir senha")}
      error={error}
      voltarPara="/conta/trocarSenhaEmail"
      footer={
        <Button
          titulo={busy ? t("Salvando...") : t("Salvar nova senha")}
          variante="primario"
          onPress={salvar}
          disabled={busy}
        />
      }
    >
      <Input
        label={t("Nova senha")}
        placeholder={t("Mín. 8 caracteres")}
        secureTextEntry
        autoComplete="new-password"
        value={senha}
        onChangeText={setSenha}
        editable={!busy}
      />

      <Input
        label={t("Confirmar nova senha")}
        placeholder={t("Repita a nova senha")}
        secureTextEntry
        autoComplete="new-password"
        value={confirmacao}
        onChangeText={setConfirmacao}
        editable={!busy}
      />
    </AuthForm>
  );
}
