import { View } from "react-native";

import { styles } from "./ProgressStyles";
import { ProgressProps } from "./ProgressTypes";

export function Progress({
  value,
  max = 100,
  height = 8,
  color = "#B7FF00",
  backgroundColor = "#2A2A3D",
}: ProgressProps) {
  const porcentagem = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <View
      style={[
        styles.trilha,
        {
          height,
          backgroundColor,
          borderRadius: height / 2,
        },
      ]}
    >
      <View
        style={[
          styles.preenchimento,
          {
            width: `${porcentagem}%`,
            height,
            backgroundColor: color,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}