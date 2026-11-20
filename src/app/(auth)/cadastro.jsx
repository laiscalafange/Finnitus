
import { useState } from "react";

import {
  Text,
  View,
  Image,
  Pressable,
} from "react-native";

import { useRouter } from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { styles as cadastroStyles } from "../../styles/cadastroStyles";

import { useAuthAction } from "../../shared/hooks/useAuthAction";
import { authService } from "../../services/auth";
import { useAuth } from "../../features/authContext";

import {
  normalizeEmail,
  validEmail,
  validatePassword,
} from "../../shared/utils/formValidation";

const inputIconStyle = {
  width: 24,
  height: 24,
  resizeMode: "contain" as const,
};

export default function Cadastro() {
  const router = useRouter();
  const { login } = useAuth();
  const { busy, error, run, clearError } = useAuthAction();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [maiorDeIdade, setMaiorDeIdade] = useState(false);
  const [leuTermos, setLeuTermos] = useState(false);

  const podeCadastrar = maiorDeIdade && leuTermos && !busy;

  function cadastrar() {
    if (!podeCadastrar) {
      return;
    }

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

      if (!maiorDeIdade || !leuTermos) {
        throw new Error(
          "Confirme que tem 18 anos ou mais e que leu os Termos e a Política de Privacidade."
        );
      }

      // Envia os valores reais dos checkboxes ao backend.
      await authService.register({
        name: normalizedName,
        email: normalized,
        password: senha,
        maiorDeIdade,
        leuTermos,
      });

      // Login automático com as confirmações.
      await login(
        normalized,
        senha,
        maiorDeIdade && leuTermos
      );

      router.replace(
        "/configuracaoInicial/FinancialData"
      );
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
        onChangeText={(valor) => {
          setNome(valor);
          clearError();
        }}
        autoCapitalize="words"
        maxLength={100}
        editable={!busy}
        icone={
          <Image
            accessible={false}
            source={require("../../../assets/icones/boneco.png")}
            style={inputIconStyle}
          />
        }
      />

      <Input
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={(valor) => {
          setEmail(valor);
          clearError();
        }}
        keyboardType="email-address"
        autoComplete="email"
        editable={!busy}
        icone={
          <Image
            source={require("../../../assets/icones/email3.png")}
            style={inputIconStyle}
          />
        }
      />

      <Input
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={(valor) => {
          setSenha(valor);
          clearError();
        }}
        autoComplete="new-password"
        editable={!busy}
        icone={
          <Image
            source={require("../../../assets/icones/senha.png")}
            style={inputIconStyle}
          />
        }
      />

      <Input
        label="Confirme a senha"
        placeholder="Repita sua senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={(valor) => {
          setConfirmarSenha(valor);
          clearError();
        }}
        editable={!busy}
        icone={
          <Image
            accessible={false}
            source={require("../../../assets/icones/senha.png")}
            style={inputIconStyle}
          />
        }
      />

      <View style={{ gap: 3 }}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: maiorDeIdade,
            disabled: busy,
          }}
          disabled={busy}
          onPress={() => {
            setMaiorDeIdade((anterior) => !anterior);
            clearError();
          }}
          style={{ paddingVertical: 3 }}
          hitSlop={6}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
            {maiorDeIdade ? "☑" : "☐"} Confirmo que tenho 18 anos ou mais.
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: leuTermos,
            disabled: busy,
          }}
          disabled={busy}
          onPress={() => {
            setLeuTermos((anterior) => !anterior);
            clearError();
          }}
          style={{ paddingVertical: 3 }}
          hitSlop={6}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
            {leuTermos ? "☑" : "☐"} Confirmo que li os documentos legais abaixo.
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="link"
          onPress={() =>
            router.push("/legal/termos-de-uso")
          }
          style={{ paddingVertical: 3 }}
          hitSlop={6}
        >
          <Text
            style={{
              color: "#FFF081",
              textDecorationLine: "underline",
            }}
          >
            Ler Termos de Uso
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="link"
          onPress={() =>
            router.push("/legal/politica-de-privacidade")
          }
          style={{ paddingVertical: 3 }}
          hitSlop={6}
        >
          <Text
            style={{
              color: "#FFF081",
              textDecorationLine: "underline",
            }}
          >
            Ler Política de Privacidade
          </Text>
        </Pressable>

        <View style={{ gap: 10, marginTop: 7 }}>
          <Button
            titulo={
              busy ? "Cadastrando..." : "Cadastrar"
            }
            variante="primario"
            onPress={cadastrar}
            disabled={!podeCadastrar}
          />

          <Button
            titulo="Já tenho conta"
            variante="primario"
            onPress={() =>
              router.replace("/login")
            }
            disabled={busy}
          />
        </View>
      </View>
    </AuthForm>
  );
}
