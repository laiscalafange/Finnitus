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
  const [maiorDeIdade, setMaiorDeIdade] = useState(false);
  const [leuTermos, setLeuTermos] = useState(false);

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
      if (!maiorDeIdade || !leuTermos) {
        throw new Error("Confirme que tem 18 anos ou mais e que leu os Termos e a Política de Privacidade.");
      }

      await authService.register({
        name: normalizedName,
        email: normalized,
        password: senha,
        maiorDeIdade: true,
        leuTermos: true,
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
            accessible={false}
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
            accessible={false}
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
            accessible={false}
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
            accessible={false}
            source={require(
              "../../../assets/icones/senha.png"
            )}
            style={inputIconStyle}
          />
        }
      />

      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: maiorDeIdade }}
        disabled={busy} onPress={() => setMaiorDeIdade(!maiorDeIdade)}
        style={{ paddingVertical: 10 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
          {maiorDeIdade ? '☑' : '☐'} Confirmo que tenho 18 anos ou mais.
        </Text>
      </Pressable>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: leuTermos }}
        disabled={busy} onPress={() => setLeuTermos(!leuTermos)}
        style={{ paddingVertical: 10 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
          {leuTermos ? '☑' : '☐'} Confirmo que li os documentos legais abaixo.
        </Text>
      </Pressable>
      <Pressable accessibilityRole="link" onPress={() => router.push('/legal/termos-de-uso')}
        style={{ paddingVertical: 8 }}>
        <Text style={{ color: '#FFF081', textDecorationLine: 'underline' }}>Ler Termos de Uso</Text>
      </Pressable>
      <Pressable accessibilityRole="link" onPress={() => router.push('/legal/politica-de-privacidade')}
        style={{ paddingVertical: 8 }}>
        <Text style={{ color: '#FFF081', textDecorationLine: 'underline' }}>Ler Política de Privacidade</Text>
      </Pressable>
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