import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderInterno } from "../../shared/components/Header";
import { CardNotificacao, TipoNotificacao } from "../../shared/components/CardsNotificacoes";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";

//Tipos de notificações

interface Notificacao {
    id: string;
    tipo: TipoNotificacao;
    mensagem: string;
    tempo: string;
}

//Dados de exemplo

const NOTIFICACOES_MOCK: Notificacao[] = [
    {
        id: "1",
        tipo: "meta",
        mensagem: 'Você está a apenas R$180 de alcançar a meta "viagem"',
        tempo: "Há 1h",
    },
    {
        id: "2",
        tipo: "alerta",
        mensagem: 'Seus gastos em "lazer" já passaram em 43% do orçamento',
        tempo: "Há 7h",
    },
    {
        id: "3",
        tipo: "concluida",
        mensagem: 'Parabéns! Meta "tênis novo" foi concluída',
        tempo: "Há 2d",
    },
];

export default function Notificacoes() {
    return (
        <LinearGradient
            colors={["#3f1e69", "#08070A", "#291444"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.conteudo}
            >

                {/* Cabeçalho */}
                <HeaderInterno
                titulo="Notificações"
                subtitulo="Detalhes" />

                {/* Lista de notificações */}
                <View style={styles.conteudoLista}>

                    <View style={styles.linhaMarcarTodas}>
                        <TouchableOpacity>
                            <Text style={styles.marcarTodas}>Marcar todas</Text>
                        </TouchableOpacity>
                    </View>

                    {NOTIFICACOES_MOCK.map((notificacao) => (
                        <CardNotificacao
                            key={notificacao.id}
                            tipo={notificacao.tipo}
                            mensagem={notificacao.mensagem}
                            tempo={notificacao.tempo}
                        />
                    ))}

                </View>

            </ScrollView>
        </LinearGradient>
    );
}

//CSS da página

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    conteudo: {
        paddingBottom: 30,
    },

    conteudoLista: {
        paddingHorizontal: 16,
        paddingTop: 18,
        marginTop: -300,
    },

    linhaMarcarTodas: {
        alignItems: "flex-end",
        marginBottom: 2,
    },

    marcarTodas: {
        fontFamily: FONTS.quicksand.semibold,
        fontSize: 13,
        color: Cores.destaque.limao,
    },
});