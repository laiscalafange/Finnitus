import { useEffect } from "react";

import {
  Redirect,
  useRouter,
} from "expo-router";

import { AuthForm } from "../../shared/components/AuthForm";
import { Button } from "../../shared/components/Button";
import { useAuth } from "../../features/authContext";
import { useLocalSearchParams } from "expo-router";
import { Text, View, Image } from "react-native";

import {
  styles as emailStyles,
} from "../../styles/emailSentStyles";

export default function EmailSent() {
  const router = useRouter();

  const { recoveryEmail } = useAuth();

  const params = useLocalSearchParams<{ modo?: string }>();
  const trocando = params.modo === "trocar";

  useEffect(() => {
    if (!recoveryEmail) {
      return;
    }

    const timer = setTimeout(() => {
      router.replace({
        pathname: "/verifyEmail",
        params: trocando ? { modo: "trocar" } : {},
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [recoveryEmail, router, trocando]);

  if (!recoveryEmail) {
    return (
      <Redirect
        href={{
          pathname: "/forgotPassword",
          params: trocando ? { modo: "trocar" } : {},
        }}
      />
    );
  }

  return (
    <AuthForm
  title="Confira seu e-mail"
  header={
    <View style={{ alignItems: "center" }}>
      <Image
        source={require("../../../assets/icones/sent.png")}
        style={emailStyles.icone}
      />

      <Text style={emailStyles.titulo}>
        <Text style={emailStyles.tituloDestaque}>
          Confira
        </Text>
        {" "}seu e-mail
      </Text>

      <Text
        style={[
          emailStyles.subtitulo,
          { marginBottom: 20 },
        ]}
      >
        Se houver uma conta com esse e-mail, você receberá
        um código. Confira também o spam.
      </Text>
    </View>
  }
>
      <Button
        titulo="Já tenho o código"
        onPress={() => {
          router.replace({
            pathname: "/verifyEmail",
            params: trocando ? { modo: "trocar" } : {},
          });
        }}
      />
    </AuthForm>
  );
}