import { Stack } from "expo-router";

export default function AuthLayout() {

  return (

    <Stack>
      <Stack.Screen
        name="cadastro"
        options={{
          title: "Cadastro",
        }}
      />

      <Stack.Screen
        name="emailSent"
        options={{
          title: "Email Enviado",
        }}
      />

      <Stack.Screen
        name="forgotPassword"
        options={{
          title: "Esqueci a Senha",
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />

    </Stack>

  );
}