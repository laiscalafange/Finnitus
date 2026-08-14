import { View } from "react-native";

export function Underline({
  width = 80,
  marginTop = 8,
  marginBottom = -12,
  marginLeft = 30,
}: {
  width?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
}) {
  return (
    <View
      style={{
        width,
        height: 4,
        backgroundColor: "#9B5CF6",
        borderRadius: 0,

        marginTop,
        marginBottom,
        marginLeft,
      }}
    />
  );
}