import { useState } from "react";

import {
  Text,
  View,
  Image,
} from "react-native";

import { useRouter } from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { styles as cadastroStyles } from "../../styles/cadastroStyles";

import { useAction } from "../../shared/hooks/useAction";
import { authService } from "../../services/auth";

import {
  normalizeEmail,
  validEmail,
  validatePassword,
} from "../../shared/utils/formValidation";

const inputIconStyle = {
  width: 24,
  height: 24,
  resizeMode: "contain",
};

export default function Cadastro() {
  const router = useRouter();

  const { busy, error, run } = useAction();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState("");

  function cadastrar() {
    void run(async () => {
      const normalized = normalizeEmail(email);
      const normalizedName = nome.trim();

      if (!validEmail(normalized)) {
        throw new Error("Informe um e-mail válido.");
      }

      if (
        normalizedName.length < 2 ||
        normalizedName.length > 100
      ) {
        throw new Error(
          "Informe um nome entre 2 e 100 caracteres."
        );
      }

      validatePassword(senha, confirmarSenha);

      await authService.register({
        name: normalizedName,
        email: normalized,
        password: senha,
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
      error={error}
      header={
        <View>
          <Text style={cadastroStyles.title2}>
            Crie{" "}
            <Text style={cadastroStyles.title}>
              sua conta
            </Text>
          </Text>

          <Text style={cadastroStyles.subtitle}>
            Preencha seus dados.
          </Text>
        </View>
      }
    >
      <Input
        label="Nome"
        placeholder="Digite seu nome completo"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        maxLength={100}
        editable={!busy}
        icone={
          <Image
            source={require(
              "../../../assets/icones/boneco.png"
            )}
            style={inputIconStyle}
          />
        }
      />

      <Input
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        editable={!busy}
        icone={
          <Image
            source={require(
              "../../../assets/icones/email3.png"
            )}
            style={inputIconStyle}
          />
        }
      />

      <Input
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        autoComplete="new-password"
        editable={!busy}
        icone={
          <Image
            source={require(
              "../../../assets/icones/senha.png"
            )}
            style={inputIconStyle}
          />
        }
      />

      <Input
        label="Confirme a senha"
        placeholder="Repita sua senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        editable={!busy}
        icone={
          <Image
            source={require(
              "../../../assets/icones/senha.png"
            )}
            style={inputIconStyle}
          />
        }
      />

      <Button
        titulo={
          busy ? "Cadastrando..." : "Cadastrar"
        }
        variante="primario"
        onPress={cadastrar}
        disabled={busy}
      />

      <Button
        titulo="Já tenho conta"
        variante="primario"
        onPress={() => router.replace("/login")}
        disabled={busy}
      />
    </AuthForm>
  );
}