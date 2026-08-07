// components/Underline.tsx

import { View } from "react-native";

export function Underline({
  width = 80,
  color = "#9B5CF6",
}: {
  width?: number;
  color?: string;
}) {
  return (
    <View
      style={{
        width: 100,
        height: 4,
        backgroundColor: color,
        borderRadius: 0,

        // Espaço entre o texto e a linha
        marginTop: 8,
        marginBottom: -12,
        // Deslocamento horizontal
        marginLeft: 30,

        // Deslocamento vertical
        // top: 2,
      }}
    />
  );
}