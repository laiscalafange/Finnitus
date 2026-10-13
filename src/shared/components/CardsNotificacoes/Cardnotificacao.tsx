import { Image, Text, View, TouchableOpacity } from "react-native";

import { Card } from "../Cards";

import { styles } from "./Cardnotificacaostyles";
import { CardNotificacaoProps, TipoNotificacao } from "./Cardnotificacaotypes";

function iconePorTipo(tipo: TipoNotificacao) {
  // Cada tipo tem o seu ícone: contas (conta/despesa fixa), eventos
  // (calendário), alerta e, nos demais (metas), a medalha
  const fonte =
    tipo === "alerta"
      ? require("../../../../assets/icones/alerta.png")
      : tipo === "conta"
        ? require("../../../../assets/icones/contas.png")
        : tipo === "evento"
          ? require("../../../../assets/icones/calendar.png")
          : require("../../../../assets/icones/medalha.png");

  return <Image source={fonte} style={styles.icone} />;
}

export function CardNotificacao({
  tipo,
  mensagem,
  tempo,
  lida = false,
  onPress,
}: CardNotificacaoProps) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.wrapper, lida && styles.wrapperLida]}
    >
      <Card
        gradiente={["rgba(92, 36, 147, 0.49)", "rgba(88,41,150,0.10)"]}
        // Cor da borda muda de acordo com "lida" — indicador principal,
        // bem mais visível do que só a opacidade
        style={[styles.card, lida ? styles.cardLida : styles.cardNaoLida]}
      >
        <View style={styles.icone}>{iconePorTipo(tipo)}</View>

        <View style={styles.textoContainer}>
          <Text style={styles.mensagem}>{mensagem}</Text>
          <Text style={styles.tempo}>{tempo}</Text>
        </View>
      </Card>

      {!lida && <View style={styles.bolinhaNaoLida} />}
    </TouchableOpacity>
  );
}