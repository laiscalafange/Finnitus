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

export function Avatar({ image, name, size = 48, semBorda = false }: AvatarProps) {
  const dimensoes = {
    width: size,
    height: size,
    borderRadius: size / 2,
    // Borda proporcional ao tamanho (no Perfil, size 200, continua 10).
    // Na Home (semBorda) não aparece a borda preta em volta da foto.
    borderWidth: semBorda ? 0 : Math.round(size * 0.05),
    borderColor: "#0B0B0F",
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