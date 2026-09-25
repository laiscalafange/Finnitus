import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

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
                <Pressable style={styles.fundo} onPress={onClose} />

                <View style={styles.modal}>
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

                    <TouchableOpacity
                        style={styles.cancelar}
                        activeOpacity={0.8}
                        onPress={onClose}
                    >
                        <Text style={styles.textoCancelar}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay:
    {
        flex: 1,
        justifyContent: "flex-end",
    },

    fundo: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
    },

    modal: {
        backgroundColor: "#160B24",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28, paddingHorizontal: 24,
        paddingTop: 26,
        paddingBottom: 35,
        borderWidth: 1,
        borderColor: "#3b1b92",
    },

    titulo: {
        color: "#FFFFFF",
        fontSize: 21,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },

    subtitulo: {
        color: "#BDB6C7",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 22,
    },

    opcao: {
        height: 58,
        borderRadius: 16,
        backgroundColor: "#241237",
        borderWidth: 1,
        borderColor: "#3b1b92",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        marginBottom: 12,
    },

    icone: {
        color: "#B7FF00",
        fontSize: 14,
        fontWeight: "700",
        width: 75,
    },

    textoOpcao: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },

    opcaoRemover: {
        height: 52,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
        marginBottom: 10,
    },

    textoRemover: {
        color: "#FF7777",
        fontSize: 15,
        fontWeight: "600",
    },

    cancelar: {
        height: 52,
        borderRadius: 16,
        backgroundColor: "#B7FF00",
        alignItems: "center",
        justifyContent: "center",
    },

    textoCancelar: {
        color: "#0C130E",
        fontSize: 16,
        fontWeight: "700",
    },
});
