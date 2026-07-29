import { View, Image, Text } from "react-native";

import { styles } from "./AvatarStyles";
import { AvatarProps } from "./AvatarTypes";

function obterIniciais(name: string) {
  const partes = name.trim().split(" ").filter(Boolean);

  if (partes.length === 0) return "";
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();

  return (
    partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
  ).toUpperCase();
}

export function Avatar({ image, name, size = 48 }: AvatarProps) {
  const dimensoes = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (image) {
    return <Image source={{ uri: image }} style={[styles.imagem, dimensoes]} />;
  }

  if (name) {
    return (
      <View style={[styles.container, dimensoes]}>
        <Text style={[styles.iniciais, { fontSize: size / 2.2 }]}>
          {obterIniciais(name)}
        </Text>
      </View>
    );
  }

  return <View style={[styles.vazio, dimensoes]} />;
}