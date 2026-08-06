import { View, Text } from "react-native";
import { styles } from "./BenefitStyles";
import { BenefitProps } from "./BenefitTypes";

export function Benefit({ icon, title, description }: BenefitProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>

      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}