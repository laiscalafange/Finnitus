import { Stack } from "expo-router";

// Função principal do layout quee define a navegação do aplicativo
export default function RootLayout() {
  return (

    // Inicia a navegação em pilha (Stack)
    <Stack>

      {/* Tela inicial do aplicativo */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Esconde a barra superior
        }}
      />

      {/* Tela de Login */}
      <Stack.Screen
        name="autenticacao/login"
        options={{
          title: "Login", // Título exibido no topo
        }}
      />

      {/* Tela de Cadastro */}
      <Stack.Screen
        name="autenticacao/cadastro"
        options={{
          title: "Cadastro",
        }}
      />

      {/* Tela de Recuperação de Senha */}
      <Stack.Screen
        name="autenticacao/recuperarSenha"
        options={{
          title: "Recuperar Senha",
        }}
      />

      {/* Grupo das abas do aplicativo */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false, // Não mostra cabeçalho nas tabs
        }}
      />

    </Stack>
  );
}