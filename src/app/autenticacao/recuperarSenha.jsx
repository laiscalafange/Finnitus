import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Button } from "react-native";

export default function RecuperarSenha() {

const roteador = useRouter();

  return (
    <View style={styles.container}>
      <Text>se vira fi</Text>

      <Button
              title="voltar"
              onPress={() => roteador.push("autenticacao/cadastro")}
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