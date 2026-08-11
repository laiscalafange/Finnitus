import { Image, Text, View } from "react-native";

import { Card } from "../Cards";

import { styles } from "./Cardnotificacaostyles";
import { CardNotificacaoProps, TipoNotificacao } from "./Cardnotificacaotypes";

// Ícone de acordo com o tipo da notificação
function iconePorTipo(tipo: TipoNotificacao) {
  if (tipo === "alerta") {
    return (
      <Image
        source={require("../../../../assets/icones/alerta.png")}
        style={styles.icone}
      />
    );
  }

  return (
    <Image
      source={require("../../../../assets/icones/medalha.png")}
      style={styles.icone}
    />
  );
}

export function CardNotificacao({
  tipo,
  mensagem,
  tempo,
}: CardNotificacaoProps) {
  return (
    <Card gradiente={["rgba(92, 36, 147, 0.49)", "rgba(88,41,150,0.10)"]} style={styles.card}>
      <View style={styles.icone}>{iconePorTipo(tipo)}</View>

      <View style={styles.textoContainer}>
        <Text style={styles.mensagem}>{mensagem}</Text>
        <Text style={styles.tempo}>{tempo}</Text>
      </View>
    </Card>
  );
}