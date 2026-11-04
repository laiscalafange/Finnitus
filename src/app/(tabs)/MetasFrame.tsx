
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";

import { Card } from "../../shared/components/Cards";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";

import { styles } from "@/features/menuMais/components/ModalReserva/styles";
import { formatarMoeda } from "@/features/menuMais/utils";

// Paleta exclusiva dos modais de metas
const CORES_MODAL = {
  fundo: "rgba(44, 27, 67, 0.92)",
  botaoPrincipal: "rgba(89, 48, 145, 0.78)",
  botaoSecundario: "rgba(56, 32, 91, 0.65)",
  borda: "rgba(163, 87, 255, 0.25)",
  limao: "#B7FF00",
  textoSecundario: "#C7A9F5",
};

const estilosMetas = StyleSheet.create({
  card: {
    width: "86%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: CORES_MODAL.borda,
  },

  botoes: {
    width: "100%",
    gap: 16,
    marginTop: 18,
  },

  botaoPrincipal: {
    width: "100%",
    minHeight: 46,
    backgroundColor: CORES_MODAL.botaoPrincipal,
    borderWidth: 1,
    borderColor: CORES_MODAL.borda,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  botaoSecundario: {
    width: "100%",
    minHeight: 46,
    backgroundColor: CORES_MODAL.botaoSecundario,
    borderWidth: 1,
    borderColor: CORES_MODAL.borda,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  textoBotaoPrincipal: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: CORES_MODAL.limao,
    textAlign: "center",
  },

  textoBotaoSecundario: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: CORES_MODAL.textoSecundario,
    textAlign: "center",
  },
});

type Props = {
  visible?: boolean;
  tipo?: "criada" | "alcancada";
  nome?: string;
  valor?: number;
  onClose?: () => void;
};

export default function MetasFrame({
  visible = false,
  tipo = "criada",
  nome = "",
  valor = 0,
  onClose = () => {},
}: Props) {
  const router = useRouter();

  const alcancada = tipo === "alcancada";

  function irParaMetas() {
    onClose();
    router.navigate("/metas");
  }

  function definirNovaMeta() {
    onClose();
    router.navigate({
      pathname: "/MetasFuturas",
      params: { tipo: "longoPrazo" },
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Fundo escurecido: tocar fora fecha */}
        <Pressable
          style={styles.fundo}
          onPress={onClose}
        />

        {/* Card principal */}
        <Card
          gradiente={[
            CORES_MODAL.fundo,
            CORES_MODAL.fundo,
          ]}
          style={[styles.card, estilosMetas.card]}
        >
          {/* Botão de fechar */}
          <Pressable
            style={styles.fechar}
            onPress={onClose}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <X
              size={22}
              color={Cores.texto.claro}
            />
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

            {/* Título */}
            <Text
              style={[
                styles.titulo,
                styles.tituloCentro,
              ]}
            >
              {alcancada
                ? "Meta alcançada!"
                : "Meta criada!"}
            </Text>

            {/* Mensagem */}
            <Text style={styles.texto}>
              {alcancada
                ? `Você guardou ${formatarMoeda(valor)} para ${nome}. Continue assim!`
                : `Sua meta "${nome}" de ${formatarMoeda(valor)} está pronta. Agora é só começar a guardar!`}
            </Text>

            {/* Botões */}
            <View
              style={[
                styles.botoes,
                estilosMetas.botoes,
              ]}
            >
              {alcancada ? (
                <>
                  {/* Definir nova meta */}
                  <Pressable
                    style={estilosMetas.botaoPrincipal}
                    onPress={definirNovaMeta}
                    accessibilityRole="button"
                  >
                    <Text
                      style={
                        estilosMetas.textoBotaoPrincipal
                      }
                    >
                      Definir nova meta
                    </Text>
                  </Pressable>

                  {/* Ver minhas metas */}
                  <Pressable
                    style={estilosMetas.botaoSecundario}
                    onPress={irParaMetas}
                    accessibilityRole="button"
                  >
                    <Text
                      style={
                        estilosMetas.textoBotaoSecundario
                      }
                    >
                      Ver minhas metas
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  {/* Ver minhas metas */}
                  <Pressable
                    style={estilosMetas.botaoPrincipal}
                    onPress={irParaMetas}
                    accessibilityRole="button"
                  >
                    <Text
                      style={
                        estilosMetas.textoBotaoPrincipal
                      }
                    >
                      Ver minhas metas
                    </Text>
                  </Pressable>

                  {/* Criar outra meta */}
                  <Pressable
                    style={estilosMetas.botaoSecundario}
                    onPress={onClose}
                    accessibilityRole="button"
                  >
                    <Text
                      style={
                        estilosMetas.textoBotaoSecundario
                      }
                    >
                      Criar outra meta
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Card>
      </View>
    </Modal>
  );
}
