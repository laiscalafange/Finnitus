import { useState } from "react";
import { useRouter } from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { useAction } from "../../shared/hooks/useAction";
import { authService } from "../../services/auth";

import {
  normalizeEmail,
  normalizePhone,
  validEmail,
  validatePassword,
  validateProfile,
} from "../../shared/utils/formValidation";

export default function Cadastro() {
  const router = useRouter();

  const {
    busy,
    error,
    run,
  } = useAction();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [telefone, setTelefone] = useState("");
  const [nascimento, setNascimento] = useState("");

  function cadastrar() {
    void run(async () => {
      const normalized = normalizeEmail(email);
      const phone = normalizePhone(telefone);

      if (!validEmail(normalized)) {
        throw new Error(
          "Informe um e-mail válido."
        );
      }

      validateProfile(
        nome,
        phone,
        nascimento
      );

      validatePassword(
        senha,
        confirmarSenha
      );

      await authService.register({
        name: nome.trim(),
        email: normalized,
        password: senha,
        telefone: phone,
        data_nasc: nascimento,
      });

      router.replace({
        pathname: "/login",

        params: {
          cadastrado: "1",
          email: normalized,
        },
      });
    });
  }

  return (
    <AuthForm
      title="Crie sua conta"
      subtitle="Preencha seus dados para começar."
      error={error}
    >
      <Input
        label="Nome"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        maxLength={100}
        editable={!busy}
      />

      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        editable={!busy}
      />

      <Input
        label="Telefone"
        placeholder="11999999999"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
        editable={!busy}
      />

      <Input
        label="Nascimento (AAAA-MM-DD)"
        placeholder="2000-01-31"
        value={nascimento}
        onChangeText={setNascimento}
        maxLength={10}
        editable={!busy}
      />

      <Input
        label="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        autoComplete="new-password"
        editable={!busy}
      />

      <Input
        label="Confirme a senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        editable={!busy}
      />

      <Button
        titulo={
          busy
            ? "Cadastrando..."
            : "Cadastrar"
        }
        onPress={cadastrar}
        disabled={busy}
      />

      <Button
        titulo="Já tenho conta"
        variante="outline"
        onPress={() => router.replace("/login")}
        disabled={busy}
      />
    </AuthForm>
  );
}