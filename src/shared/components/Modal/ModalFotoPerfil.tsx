
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { Card } from "../Cards";
import { FONTS } from "../../constants/Tipografia";

type Props = {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
  onRemove: () => void;
  hasImage: boolean;
};

const CORES = {
  fundo: "#211235e0",
  fundoSecundario: "#2c1b43e0",
  borda: "rgba(163, 87, 255, 0.24)",
  branco: "#F5F0FF",
  secundario: "#C6B2DD",
  verde: "#B7FF00",
  erro: "#FF7777",
};

export function ModalFotoPerfil({
  visible,
  onClose,
  onImageSelected,
  onRemove,
  hasImage,
}: Props) {
  const insets = useSafeAreaInsets();

  async function abrirGaleria() {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets?.[0]?.uri) {
        onImageSelected(resultado.assets[0].uri);
      }
    } catch (erro) {
      console.error("Erro ao abrir galeria:", erro);

      Alert.alert(
        "Não foi possível abrir a galeria",
        "Tente novamente."
      );
    }
  }

  async function abrirCamera() {
    try {
      const permissao =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          "Permissão necessária",
          "Autorize o acesso à câmera para tirar uma foto."
        );
        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets?.[0]?.uri) {
        onImageSelected(resultado.assets[0].uri);
      }
    } catch (erro) {
      console.error("Erro ao abrir câmera:", erro);

      Alert.alert(
        "Não foi possível abrir a câmera",
        "Tente novamente."
      );
    }
  }

  function removerFoto() {
    onRemove();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.fundo}
          onPress={onClose}
        />

        <Card
          gradiente={[
            "rgba(44, 27, 67, 0.86)",
            "rgba(33, 18, 53, 0.88)",
          ]}
          style={styles.modal}
        >
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.conteudo,
              {
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
          >
            <View style={styles.indicador} />

            <Text style={styles.titulo}>
              Alterar foto de perfil
            </Text>

            <Text style={styles.subtitulo}>
              Escolha como deseja adicionar sua foto.
            </Text>

            {/* CÂMERA */}
            <TouchableOpacity
              style={styles.opcao}
              activeOpacity={0.8}
              onPress={abrirCamera}
            >
              <View style={styles.iconeContainer}>
                <Text style={styles.icone}>
                  Câmera
                </Text>
              </View>

              <Text style={styles.textoOpcao}>
                Tirar uma foto
              </Text>
            </TouchableOpacity>

            {/* GALERIA */}
            <TouchableOpacity
              style={styles.opcao}
              activeOpacity={0.8}
              onPress={abrirGaleria}
            >
              <View style={styles.iconeContainer}>
                <Text style={styles.icone}>
                  Galeria
                </Text>
              </View>

              <Text style={styles.textoOpcao}>
                Escolher da galeria
              </Text>
            </TouchableOpacity>

            {/* REMOVER FOTO */}
            {hasImage && (
              <TouchableOpacity
                style={styles.opcaoRemover}
                activeOpacity={0.8}
                onPress={removerFoto}
              >
                <Text style={styles.textoRemover}>
                  Remover foto
                </Text>
              </TouchableOpacity>
            )}

            {/* CANCELAR */}
            <TouchableOpacity
              style={styles.botaoCancelar}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  fundo: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.68)",
  },

  modal: {
    width: "100%",
    maxHeight: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: CORES.borda,
    padding: 0,
    marginBottom: 0,
    overflow: "hidden",
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  indicador: {
    width: 42,
    height: 4,
    borderRadius: 4,
    backgroundColor: "rgba(217, 197, 245, 0.45)",
    alignSelf: "center",
    marginBottom: 20,
  },

  titulo: {
    fontFamily: FONTS.raleway.bold,
    color: CORES.branco,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 6,
  },

  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    color: CORES.secundario,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },

  opcao: {
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: CORES.fundoSecundario,
    borderWidth: 1,
    borderColor: CORES.borda,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  iconeContainer: {
    minWidth: 75,
    marginRight: 8,
  },

  icone: {
    fontFamily: FONTS.raleway.bold,
    color: CORES.verde,
    fontSize: 13,
  },

  textoOpcao: {
    fontFamily: FONTS.quicksand.bold,
    color: CORES.branco,
    fontSize: 14,
    flexShrink: 1,
  },

  opcaoRemover: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 8,
  },

  textoRemover: {
    fontFamily: FONTS.quicksand.bold,
    color: CORES.erro,
    fontSize: 14,
  },

  botaoCancelar: {
    minHeight: 40,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.55)",
    backgroundColor: "rgba(163, 87, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  textoCancelar: {
    fontFamily: FONTS.raleway.bold,
    color: CORES.erro,
    fontSize: 15,
  },
});
