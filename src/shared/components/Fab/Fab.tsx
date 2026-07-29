import { Pressable } from "react-native";

import { styles } from "./FabStyles";
import { FABProps } from "./FabTypes";

export function FAB({ icon, onPress, bottom = 24, right = 24 }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.botao,
        { bottom, right },
        pressed && { opacity: 0.8 },
      ]}
    >
      {icon}
    </Pressable>
  );
}