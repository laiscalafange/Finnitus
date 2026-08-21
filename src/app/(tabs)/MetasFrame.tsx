import { Image, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/metasframe";

export default function MetasFrame() {
  // Hook de navegação do Expo Router
  const router = useRouter();

  return (
    // Overlay escuro por trás do card, tipo modal/popup flutuante
    <View style={styles.overlay}>

      <Card
        gradiente={["#211D2D", "#171421"]}
        style={styles.frame}
      >

        {/* Ícone da meta alcançada */}
        <Image
          source={require("../../../assets/icones/sent.png")}
          style={styles.icone}
          resizeMode="contain"
        />

        {/* Título */}
        <Text style={styles.titulo}>
          Meta alcançada!
        </Text>

        {/* Mensagem — TODO: valor e nome da meta hardcoded, futuramente
            vêm da meta real que foi concluída (via props ou params de rota) */}
        <Text style={styles.mensagem}>
          Você guardou R$1.500,00 para{"\n"}
          presente, Continue assim !
        </Text>

        {/* Botão "Definir nova meta" — leva pra tela de criação de metas
            TODO: ajustar "/metas-futuras" pro nome real da rota, se for diferente */}
        <Button
          titulo="Definir nova meta"
          variante="secundario"
          onPress={() => router.push("/MetasFuturas")}
        />

        {/* Botão "Ver minhas metas" — leva pra tela com a lista de metas
            TODO: ajustar "/metas" pro nome real da rota, se for diferente */}
        <Button
          titulo="Ver minhas metas"
          variante="botaotexto"
          onPress={() => router.push("/metas")}
        />

      </Card>

    </View>
  );
}