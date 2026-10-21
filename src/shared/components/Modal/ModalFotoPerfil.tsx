import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Card } from "../Cards";
import { Button } from "../Button";

import { Cores } from "../../constants/Cores";
import { FONTS } from "../../constants/Tipografia";

type Props = {
    visible: boolean;
    onClose: () => void;
    onImageSelected: (uri: string) => void;
    onRemove: () => void;
    hasImage: boolean;
};

export function ModalFotoPerfil({
    visible,
    onClose,
    onImageSelected,
    onRemove,
    hasImage,
}: Props) {
    async function abrirGaleria() {
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!resultado.canceled) {
            onImageSelected(resultado.assets[0].uri);
            onClose();
        }
    }

    async function abrirCamera() {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissao.granted) {
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!resultado.canceled) {
            onImageSelected(resultado.assets[0].uri);
            onClose();
        }
    }

    function removerFoto() {
        onRemove();
        onClose();
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Fundo escurecido (mesmo dos outros modais): tocar fora fecha */}
                <Pressable style={styles.fundo} onPress={onClose} />

                {/* Mesmo card roxo translúcido do ModalConfirmarAcao */}
                <Card
                    gradiente={["rgba(73, 38, 155, 0.97)", "rgba(45, 17, 108, 0.97)"]}
                    style={styles.modal}
                >
                    <Text style={styles.titulo}>Alterar foto de perfil</Text>

                    <Text style={styles.subtitulo}>
                        Escolha como deseja adicionar sua foto.
                    </Text>

                    <TouchableOpacity
                        style={styles.opcao}
                        activeOpacity={0.8}
                        onPress={abrirCamera}
                    >
                        <Text style={styles.icone}>Câmera</Text>
                        <Text style={styles.textoOpcao}>Tirar uma foto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.opcao}
                        activeOpacity={0.8}
                        onPress={abrirGaleria}
                    >
                        <Text style={styles.icone}>Galeria</Text>
                        <Text style={styles.textoOpcao}>Escolher da galeria</Text>
                    </TouchableOpacity>

                    {hasImage && (
                        <TouchableOpacity
                            style={styles.opcaoRemover}
                            activeOpacity={0.8}
                            onPress={removerFoto}
                        >
                            <Text style={styles.textoRemover}>Remover foto</Text>
                        </TouchableOpacity>
                    )}

                    {/* Mesmo botão "Cancelar" (contorno) do ModalConfirmarAcao */}
                    <Button
                        titulo="Cancelar"
                        variante="outline"
                        onPress={onClose}
                    />
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

    // Mesmo escurecimento do fundo do menu do + e dos outros modais
    fundo: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },

    // Card colado embaixo da tela (só os cantos de cima arredondados)
    modal: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        borderColor: "rgba(168, 79, 255, 0.35)",
        paddingHorizontal: 24,
        paddingTop: 26,
        paddingBottom: 15,
        marginBottom: 0,
    },

    titulo: {
        fontFamily: FONTS.raleway.bold,
        color: Cores.base.branco,
        fontSize: 21,
        textAlign: "center",
        marginBottom: 8,
    },

    subtitulo: {
        fontFamily: FONTS.quicksand.regular,
        color: Cores.texto.claro,
        fontSize: 14,
        textAlign: "center",
        marginBottom: 22,
    },

    opcao: {
        height: 58,
        borderRadius: 16,
        backgroundColor: Cores.overlay.suave,
        borderWidth: 1,
        borderColor: Cores.overlay.medio,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        marginBottom: 12,
    },

    icone: {
        fontFamily: FONTS.raleway.bold,
        color: Cores.destaque.limao,
        fontSize: 14,
        width: 75,
    },

    textoOpcao: {
        fontFamily: FONTS.quicksand.bold,
        color: Cores.base.branco,
        fontSize: 16,
    },

    opcaoRemover: {
        height: 44,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    textoRemover: {
        fontFamily: FONTS.quicksand.bold,
        color: Cores.estado.erro,
        fontSize: 15,
    },
});