import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/metasframe";

type Props = {
  // Controla se o card flutuante está aparecendo por cima da tela
  visible?: boolean;
  // Chamado ao fechar o card (tocar fora, botão voltar do Android ou
  // "Definir nova meta")
  onClose?: () => void;
};

// Card flutuante (modal) de confirmação de meta. Ele é aberto por cima da
// tela de criação (MetasFuturas) quando a pessoa toca em "Criar meta".
export default function MetasFrame({
  visible = false,
  onClose = () => {},
}: Props) {
  // Hook de navegação do Expo Router
  const router = useRouter();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay escuro por trás do card, tipo modal/popup flutuante */}
      <View style={styles.overlay}>

        {/* Tocar fora do card fecha o modal */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

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
              vêm da meta real que foi concluída (via props) */}
          <Text style={styles.mensagem}>
            Você guardou R$1.500,00 para{"\n"}
            presente, Continue assim !
          </Text>

          {/* Botão "Definir nova meta" — fecha o card e continua na tela
              de criação (que limpa os campos pra uma nova meta) */}
          <Button
            titulo="Definir nova meta"
            variante="secundario"
            onPress={onClose}
          />

          {/* Botão "Ver minhas metas" — leva pra tela com a lista de metas */}
          <Button
            titulo="Ver minhas metas"
            variante="botaotexto"
            onPress={() => {
              onClose();
              router.navigate("/metas");
            }}
          />

        </Card>

      </View>
    </Modal>
  );
}