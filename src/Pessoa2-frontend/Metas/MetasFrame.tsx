import { Image, StyleSheet, Text, View } from "react-native";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";

export default function MetasFrame() {
    return (
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

                {/* Mensagem */}
                <Text style={styles.mensagem}>
                    Você guardou R$1.500,00 para{"\n"}
                    presente, Continue assim !
                </Text>

                {/* Botão */}
                <Button
                    titulo="Definir nova meta"
                    variante="secundario"
                    onPress={() => { }}
                />

                <Button
                    titulo="Ver minhas metas"
                    variante="botaotexto"
                    onPress={() => { }}
                />

            </Card>

        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
    },

    frame: {
        width: "90%",
        minHeight: 345,
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 25,
        alignItems: "center",
        justifyContent: "center",
    },

    icone: {
        width: 75,
        height: 75,
        marginBottom: 15,
    },

    titulo: {
        fontFamily: FONTS.raleway.bold,
        fontSize: 24,
        color: Cores.destaque.limao,
        textAlign: "center",
        marginBottom: 5,
    },

    mensagem: {
        fontFamily: FONTS.quicksand.semibold,
        fontSize: 15,
        color: "#B98AFF",
        textAlign: "center",
        lineHeight: 15,
        marginBottom: 20,
    },
});