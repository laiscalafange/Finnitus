import { Text, View, StyleSheet } from "react-native";

export default function Calendario() {
  return (
    <View style={styles.container}>
      <Text>é pra colocar seus compromissozinhos</Text>
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