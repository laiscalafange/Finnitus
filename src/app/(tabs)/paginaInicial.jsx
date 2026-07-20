import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Button } from "react-native";

export default function PaginaInicial() {

const roteador = useRouter();
  return (
    <View style={styles.container}>
      <Text>autoexplicativo</Text>

    <Button
    title="calendario"
    onPress={() => roteador.push("/calendario")}
    />
    <Button
    title="dashboard"
    onPress={() => roteador.push("/dashboard")}
    />
    <Button
    title="metas"
    onPress={() => roteador.push("/metas")}
    />
    <Button
    title="perfil"
    onPress={() => roteador.push("/perfil")}
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