import { useState } from "react";
import { useRouter } from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { useAuth } from "../../features/authContext";
import { authService } from "../../services/auth";
import { useAction } from "../../shared/hooks/useAction";

import {
  normalizePhone,
  validateProfile,
} from "../../shared/utils/formValidation";

export default function Editar() {
  const router = useRouter();

  const {
    user,
    updateUser,
    logout,
  } = useAuth();

  const [name, setName] = useState(
    user?.name ?? ""
  );

  const [phone, setPhone] = useState(
    user?.telefone ?? ""
  );

  const [birth, setBirth] = useState(
    user?.data_nasc?.slice(0, 10) ?? ""
  );

  const {
    busy,
    error,
    run,
  } = useAction();

  function save() {
    void run(async () => {
      const telefone = normalizePhone(phone);

      validateProfile(
        name,
        telefone,
        birth
      );

      const updated = await authService.update({
        name: name.trim(),
        telefone,
        data_nasc: birth,
      });

      updateUser(updated);

      if (user?.profileComplete) {
        router.dismissTo("/perfil");
      } else {
        router.replace("/onboarding/BemVindo");
      }
    });
  }

  return (
    <AuthForm
      title={
        user?.profileComplete
          ? "Editar conta"
          : "Complete seu perfil"
      }
      subtitle={user?.email}
      error={error}
    >
      <Input
        label="Nome"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        editable={!busy}
      />

      <Input
        label="Telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        editable={!busy}
      />

      <Input
        label="Nascimento (AAAA-MM-DD)"
        value={birth}
        onChangeText={setBirth}
        maxLength={10}
        editable={!busy}
      />

      <Button
        titulo={busy ? "Salvando..." : "Salvar"}
        onPress={save}
        disabled={busy}
      />

      <Button
        titulo="Voltar ao perfil"
        variante="outline"
        onPress={() => router.dismissTo("/perfil")}
        disabled={busy}
      />

      <Button
        titulo="Sair da conta"
        variante="outline"
        onPress={() => void run(logout)}
        disabled={busy}
      />
    </AuthForm>
  );
}