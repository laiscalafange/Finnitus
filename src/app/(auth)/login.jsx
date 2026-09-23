import { useState } from "react";
import { Text, View } from "react-native";

import {
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import {
  AuthForm,
  formStyles,
} from "../../shared/components/AuthForm";

import { styles as loginStyles } from "../../styles/loginStyles";

import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { useAction } from "../../shared/hooks/useAction";
import { useAuth } from "../../features/authContext";
import { googleIdToken } from "../../services/google";

import {
  normalizeEmail,
  validEmail,
} from "../../shared/utils/formValidation";

export default function Login() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [email, setEmail] = useState(
    typeof params.email === "string"
      ? params.email
      : ""
  );

  const [senha, setSenha] = useState("");

  const { login, googleLogin } = useAuth();
  const { busy, error, run } = useAction();

  function entrar() {
    void run(async () => {
      const normalized = normalizeEmail(email);

      if (!validEmail(normalized) || !senha) {
        throw new Error("Preencha e-mail e senha.");
      }

      await login(normalized, senha);
    });
  }

  function google() {
    void run(async () => {
      const token = await googleIdToken();

      if (token) {
        await googleLogin(token);
      }
    });
  }

  return (
    <AuthForm
      title="Entre na sua conta"
      error={error}
      header={
        <View>
          <Text style={loginStyles.title2}>
            Entre na{" "}
            <Text style={loginStyles.title}>
              sua conta
            </Text>
          </Text>

          <Text style={loginStyles.subtitle}>
            Preencha seus dados.
          </Text>
        </View>
      }
    >
      {params.cadastrado === "1" ? (
        <Text style={formStyles.success}>
          Cadastro concluído. Entre com sua senha.
        </Text>
      ) : null}

      {params.redefinida === "1" ? (
        <Text style={formStyles.success}>
          Senha atualizada. Entre novamente.
        </Text>
      ) : null}

      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        editable={!busy}
      />

      <Input
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoComplete="current-password"
        editable={!busy}
      />

      <Button
        titulo={busy ? "Aguarde..." : "Entrar"}
        onPress={entrar}
        disabled={busy}
      />

      <Button
        titulo="Entrar com Google"
        variante="outline"
        onPress={google}
        disabled={busy}
      />

      <Button
        titulo="Esqueci minha senha"
        variante="outline"
        onPress={() => {
          router.push({
            pathname: "/forgotPassword",
            params: { email },
          });
        }}
        disabled={busy}
      />

      <Button
        titulo="Criar uma conta"
        variante="outline"
        onPress={() => router.push("/cadastro")}
        disabled={busy}
      />
    </AuthForm>
  );
}