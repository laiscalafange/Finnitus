import { View, StyleSheet } from "react-native";
import { Cores } from "../../constants/Cores";

export function ProgressDots({ total, atual }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i + 1 === atual && styles.dotAtivo,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Cores.roxo.escuro, // #240E47
  },
  dotAtivo: {
    width: 24,
    backgroundColor: Cores.destaque.limao, // #B7FF00
  },
});