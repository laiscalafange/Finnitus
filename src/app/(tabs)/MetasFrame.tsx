import { Image, Modal, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";

import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";

// Mesmo visual dos cards da Reserva de emergência (overlay, card, X, título...)
import { styles } from "@/features/menuMais/components/ModalReserva/styles";
import { formatarMoeda } from "@/features/menuMais/utils";

type Props = {
  // Controla se o card flutuante está aparecendo por cima da tela
  visible?: boolean;
  // "criada": aparece na tela de criação depois de criar a meta
  // "alcancada": aparece quando um depósito completa o valor da meta
  tipo?: "criada" | "alcancada";
  // Nome da meta e valor mostrado na mensagem (valor objetivo na "criada",
  // valor guardado na "alcançada")
  nome?: string;
  valor?: number;
  // Chamado ao fechar o card (X, tocar fora, botão voltar do Android ou ao
  // escolher uma das ações)
  onClose?: () => void;
};

// Card flutuante (modal) das metas. Tem dois jeitos, com o mesmo visual:
// "Meta criada!" e "Meta alcançada!".
export default function MetasFrame({
  visible = false,
  tipo = "criada",
  nome = "",
  valor = 0,
  onClose = () => {},
}: Props) {
  // Hook de navegação do Expo Router
  const router = useRouter();

  const alcancada = tipo === "alcancada";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Fundo escurecido: tocar fora fecha */}
        <Pressable style={styles.fundo} onPress={onClose} />

        <Card
          gradiente={["rgba(73, 38, 155, 0.95)", "rgba(45, 17, 108, 0.95)"]}
          style={styles.card}
        >
          {/* Botão X no canto superior direito */}
          <Pressable
            style={styles.fechar}
            onPress={onClose}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <X size={22} color={Cores.texto.claro} />
          </Pressable>

          <View style={styles.centralizado}>
            {/* Ícone da meta */}
            <View style={styles.iconeTopo}>
              <Image
                source={require("../../../assets/icones/sent.png")}
                style={styles.imagemIcone}
                resizeMode="contain"
              />
            </View>

            <Text style={[styles.titulo, styles.tituloCentro]}>
              {alcancada ? "Meta alcançada!" : "Meta criada!"}
            </Text>

            <Text style={styles.texto}>
              {alcancada
                ? `Você guardou ${formatarMoeda(valor)} para ${nome}. Continue assim!`
                : `Sua meta "${nome}" de ${formatarMoeda(valor)} está pronta. Agora é só começar a guardar!`}
            </Text>

            <View style={styles.botoes}>
              {alcancada ? (
                <>
                  {/* Leva pra criação de uma nova meta */}
                  <Button
                    titulo="Definir nova meta"
                    onPress={() => {
                      onClose();
                      router.navigate("/MetasFuturas");
                    }}
                  />

                  <Button
                    titulo="Ver minhas metas"
                    variante="botaotexto"
                    onPress={() => {
                      onClose();
                      router.navigate("/metas");
                    }}
                  />
                </>
              ) : (
                <>
                  {/* Leva pra tela com a lista de metas */}
                  <Button
                    titulo="Ver minhas metas"
                    onPress={() => {
                      onClose();
                      router.navigate("/metas");
                    }}
                  />

                  {/* Fecha o card e deixa a tela de criação limpa */}
                  <Button
                    titulo="Criar outra meta"
                    variante="botaotexto"
                    onPress={onClose}
                  />
                </>
              )}
            </View>
          </View>
        </Card>
      </View>
    </Modal>
  );
}