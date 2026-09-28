import { useState } from "react";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { authService } from "../../services/auth";
import { useAuth } from "../../features/authContext";
import { useAction } from "../../shared/hooks/useAction";

import {
  normalizeEmail,
  validEmail,
} from "../../shared/utils/formValidation";
import { Text, View, Image } from "react-native";

import {
  styles as recuperacaoStyles,
} from "../../styles/forgotPasswordStyles";

export default function ForgotPassword() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    email?: string;
    // Vem preenchido quando essa tela foi aberta pelo botão
    // "Trocar senha" da tela Segurança (usuário já logado) —
    // muda só o texto, o fluxo por trás é o mesmo
    modo?: string;
  }>();

  const trocando = params.modo === "trocar";

  const [email, setEmail] = useState(
    typeof params.email === "string"
      ? params.email
      : ""
  );

  const { startRecovery } = useAuth();

  const {
    busy,
    error,
    run,
  } = useAction();

  function enviar() {
    void run(async () => {
      const normalized = normalizeEmail(email);

      if (!validEmail(normalized)) {
        throw new Error(
          "Informe um e-mail válido."
        );
      }

      await authService.forgot(normalized);

      startRecovery(normalized);

      router.push({
        pathname: "/emailSent",
        params: trocando ? { modo: "trocar" } : {},
      });
    });
  }

  return (
    <AuthForm
      title={trocando ? "Trocar senha" : "Recuperar senha"}
      error={error}
      header={
        <View>
          <Text style={recuperacaoStyles.titulo}>
            <Text style={recuperacaoStyles.tituloDestaque}>
              {trocando ? "Trocar" : "Recuperar"}
            </Text>
            {" "}senha
          </Text>

          <Text
            style={[
              recuperacaoStyles.subtitulo,
              { marginBottom: 20 },
            ]}
          >
            {trocando
              ? "Confirme seu e-mail para receber um código de troca de senha."
              : "Informe seu e-mail para recuperar sua senha."}
          </Text>
        </View>
      }
    >
      <Input
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        editable={!busy}
        icone={
          <Image
            source={require("../../../assets/icones/email.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
          />
        }
      />

      <Button
        titulo={busy ? "Enviando..." : "Enviar código"}
        variante="primario"
        disabled={busy}
        onPress={enviar}
      />

      <Button
        titulo={trocando ? "Cancelar" : "Voltar ao login"}
        variante="primario"
        disabled={busy}
        onPress={() =>
          trocando
            ? router.dismissTo("/conta/seguranca")
            : router.replace("/login")
        }
      />
    </AuthForm>
  );
}