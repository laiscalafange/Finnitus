import { useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "../../shared/components/Button";

export default function Login() {
  const roteador = useRouter();

  return (
    <View style={styles.container}>
      <Text>login</Text>

      <Button
        title="Não tem conta? Cadastre-se"
        onPress={() => roteador.push("autenticacao/cadastro")}
      />
      <Button
        title="ir para tela inicial"
        onPress={() => roteador.push("/paginaInicial")}
      />

      <Button
    titulo="Esqueci minha senha"
    onPress={() => roteador.push("/autenticacao/forgotPassword")}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});