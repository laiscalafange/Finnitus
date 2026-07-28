import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Button } from "react-native";

export default function Cadastro() {

const roteador = useRouter();

  return (
    <View style={styles.container}>
      <Text>cadastro</Text>

      <Button
      title="Não lembra tua senha? te ajudo bebe"
      onPress={() => roteador.push("autenticacao/recuperarSenha")}
      />
      <Button
        title="faz login agora"
        onPress={() => roteador.push("autenticacao/login")}
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