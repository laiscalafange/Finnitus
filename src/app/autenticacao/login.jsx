import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Button } from "react-native";

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