import { Text, View, StyleSheet } from "react-native";

export default function Metas() {
  return (
    <View style={styles.container}>
      <Text>é pra colocar suas metazinhas</Text>
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