import { StyleSheet, Text, View } from "react-native";

export default function Perfil() {
  return (
    <View style={styles.container}>
      <Text>vai aparecer o usuariozinho</Text>
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