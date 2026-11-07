
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
import { useAuth } from "../../features/authContext";

import {
  normalizeEmail,
  validEmail,
  validatePassword,
} from "../../shared/utils/formValidation";

// Estilo dos ícones utilizados nos campos.
const inputIconStyle = {
  width: 24,
  height: 24,
  resizeMode: "contain",
};

export default function Cadastro() {
  const router = useRouter();
  const { login } = useAuth();

  // Controla o carregamento e as mensagens de erro.
  const { busy, error, run } = useAction();

  // Estados dos campos do formulário.
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [maiorDeIdade, setMaiorDeIdade] = useState(false);
  const [leuTermos, setLeuTermos] = useState(false);

  // Executa o cadastro do usuário.
  function cadastrar() {
    void run(async () => {
      console.log("Iniciando cadastro...");

      // Normaliza os dados informados.
      const normalized = normalizeEmail(email);
      const normalizedName = nome.trim();

      // Valida o e-mail.
      if (!validEmail(normalized)) {
        throw new Error("Informe um e-mail válido.");
      }

      // Valida o nome.
      if (
        normalizedName.length < 2 ||
        normalizedName.length > 100
      ) {
        throw new Error(
          "Informe um nome entre 2 e 100 caracteres."
        );
      }

      // Valida a senha e sua confirmação.
      validatePassword(senha, confirmarSenha);
      if (!maiorDeIdade || !leuTermos) {
        throw new Error("Confirme que tem 18 anos ou mais e que leu os Termos e a Política de Privacidade.");
      }

      console.log("Validações concluídas. Enviando cadastro para a API...");

      // Envia os dados para o backend cadastrar o usuário.
      // 1. Cria a conta do usuário no banco de dados.
      await authService.register({
       name: normalizedName,
        email: normalized,
        password: senha,
        maiorDeIdade: true,
        leuTermos: true,
      });

      // 2. Realiza o login automaticamente.
      // Essa função salva o token e atualiza o usuário no AuthContext.
      await login(normalized, senha);

      // 3. Depois que o usuário estiver autenticado,
      // permite acessar a configuração financeira inicial.
      router.replace("/configuracaoInicial/FinancialData");
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
      {/* Campo de nome do usuário. */}
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

      {/* Campo de e-mail. */}
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
            source={require("../../../assets/icones/email3.png")}
            style={inputIconStyle}
          />
        }
      />

      {/* Campo de senha. */}
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
            source={require("../../../assets/icones/senha.png")}
            style={inputIconStyle}
          />
        }
      />

      {/* Campo de confirmação da senha. */}
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

      {/* Botão para cadastrar. */}
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
        titulo={busy ? "Cadastrando..." : "Cadastrar"}
        variante="primario"
        onPress={cadastrar}
        disabled={busy}
      />

      {/* Botão para quem já possui uma conta. */}
      <Button
        titulo="Já tenho conta"
        variante="primario"
        onPress={() => router.replace("/login")}
        disabled={busy}
      />
    </AuthForm>
  );
}
