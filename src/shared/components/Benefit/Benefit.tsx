import { View, Text, Image } from "react-native";
import { styles } from "./BenefitStyles";
import { BenefitProps } from "./BenefitTypes";

export function Benefit({ icon, title, description }: BenefitProps) {
  return (
    <View style={styles.container}>
      {typeof icon === "string" ? (
        <Text style={styles.icon}>{icon}</Text>
      ) : (
        <Image source={icon} style={styles.iconImage} />
      )}
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}