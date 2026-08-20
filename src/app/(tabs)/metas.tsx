import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { CalendarioSemana } from '@/shared/components/CalendarioSemana'
import { BackgroundGradient } from '@/shared/components/backgroundGradient'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

// TODO: mover para src/app/metas/Mocks.ts, seguindo o padrão do Dashboard
const METAS_DO_MES = [
    {
        id: '1',
        icone: require('../../../assets/icones/IconMetas.png'),
        nome: 'Presente',
        prazo: 'Faltam 12 dias !',
        data: '03/06',
        valorAtual: 80,
        valorTotal: 100,
    },
    {
        id: '2',
        icone: require('../../../assets/icones/IconMetas.png'),
        nome: 'Bolsa nova',
        prazo: 'Sem data definida',
        valorAtual: 1000,
        valorTotal: 4500,
    },
    {
        id: '3',
        icone: require('../../../assets/icones/IconMetas.png'),
        nome: 'Batedeira',
        prazo: 'Sem data definida',
        data: '21/06',
        valorAtual: 200,
        valorTotal: 1200,
    },
]

const METAS_LONGO_PRAZO = [
    { id: '1', nome: 'Carro\nnovo' },
    { id: '2', nome: 'Viagem\nnova' },
    { id: '3', nome: 'Casa\nnova' },
]

export default function Metas() {
    return (
        <View style={styles.container}>
            <BackgroundGradient />

            <ScrollView style={styles.scroll}>
                <CalendarioSemana
                    titulo="Metas"
                    subtitulo="Financeiras"
                    aoSelecionarDia={(data) => console.log(data)}
                    mostrarAcoes
                    aoPressAdicionar={() => console.log('adicionar meta')}
                    aoPressEditar={() => console.log('editar metas')}
                />

                <View style={styles.conteudo}>

                    {/* ── ANÁLISES / HISTÓRICO ── */}
                    <View style={styles.navRow}>

                        {/* ANÁLISES */}
                        <TouchableOpacity
                            style={styles.navItem}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#7c4dff', '#5a2dc7']}
                                style={styles.navCaixa}
                            >
                                <Image
                                    source={require('../../../assets/icones/analise.png')}
                                    style={styles.navIconeS}
                                />
                            </LinearGradient>

                            <Text style={styles.navTextoEsquerda}>
                                Análises
                            </Text>
                        </TouchableOpacity>

                        {/* HISTÓRICO */}
                        <TouchableOpacity
                            style={styles.navItem}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#7c4dff', '#5a2dc7']}
                                style={styles.navCaixa}
                            >
                                <Image
                                    source={require('../../../assets/icones/historicoM.png')}
                                    style={styles.navIconeH}
                                />
                            </LinearGradient>

                            <Text style={styles.navTextoDireita}>
                                Histórico
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/* ── METAS DO MÊS ── */}
                    <Text style={styles.secaoTitulo}>
                        Metas do mês
                    </Text>

                    <View style={styles.metasLista}>
                        {METAS_DO_MES.map(meta => {
                            const pct = Math.min(
                                100,
                                (meta.valorAtual / meta.valorTotal) * 100
                            )

                            return (
                                <View key={meta.id} style={styles.metaLinha}>
                                    <View style={styles.metaPonto} />

                                    <LinearGradient
                                        colors={['#482287', '#330e6d']}
                                        style={styles.metaCard}
                                    >
                                        <View style={styles.metaHeader}>

                                            <View style={styles.metaIconeContainer}>
                                                <Image
                                                    source={meta.icone}
                                                    style={styles.metaIcone}
                                                />
                                            </View>

                                            <Text style={styles.metaNome}>
                                                {meta.nome}
                                            </Text>

                                            {meta.data && (
                                                <Text style={styles.metaData}>
                                                    {meta.data}
                                                </Text>
                                            )}

                                            <Text style={styles.metaMenu}>
                                                ⋮
                                            </Text>

                                        </View>

                                        <View style={styles.metaBarraFundo}>
                                            <View
                                                style={[
                                                    styles.metaBarraPreenchida,
                                                    { width: `${pct}%` },
                                                ]}
                                            />
                                        </View>

                                        <View style={styles.metaFooter}>
                                            <Text style={styles.metaPrazo}>
                                                {meta.prazo}
                                            </Text>

                                            <Text style={styles.metaValor}>
                                                ${meta.valorAtual} de ${meta.valorTotal}
                                            </Text>
                                        </View>

                                    </LinearGradient>
                                </View>
                            )
                        })}
                    </View>

                    {/* ── METAS LONGO PRAZO ── */}
                    <Text style={styles.secaoTitulo}>
                        Metas longo prazo
                    </Text>

                    <View style={styles.longoPrazoGrid}>
                        {METAS_LONGO_PRAZO.map(meta => (
                            <TouchableOpacity
                                key={meta.id}
                                style={styles.longoPrazoCard}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#6b3fc9', '#4a1f8a']}
                                    style={styles.longoPrazoGradiente}
                                >
                                    <Text style={styles.longoPrazoNome}>
                                        {meta.nome}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={styles.longoPrazoCard}
                            activeOpacity={0.8}
                        >
                            <View style={styles.adicionarCard}>
                                <Text style={styles.adicionarTexto}>+</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090B',
    },

    scroll: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    conteudo: {
        paddingHorizontal: 24,
        paddingBottom: 45,
        paddingTop: 8,
    },

    // ── NAV ANÁLISES / HISTÓRICO ───────────────────────────

    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },

    navItem: {
        width: '47%',
    },

    navCaixa: {
        height: 65,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },

    navIconeS: {
        width: 53,
        height: 50,
        resizeMode: 'contain',
        alignSelf: 'flex-start',
        marginLeft: 9,
    },

    navIconeH: {
        width: 53,
        height: 50,
        resizeMode: 'contain',
        alignSelf: 'flex-end',
        marginRight: 5,
    },

    navTextoEsquerda: {
        fontFamily: FONTS.quicksand.bold,
        fontSize: 14,
        color: '#7c4dff',
        textAlign: 'left',
        marginTop: 6,
    },

    navTextoDireita: {
        fontFamily: FONTS.quicksand.bold,
        fontSize: 14,
        color: '#7c4dff',
        textAlign: 'right',
        marginTop: 6,
    },

    // ── SEÇÃO ────────────────────────────────────────────────

    secaoTitulo: {
        fontFamily: FONTS.raleway.extrabold,
        fontSize: 22,
        color: Cores.destaque.limao,
        marginBottom: 12,
    },

    // ── METAS DO MÊS ─────────────────────────────────────────

    metasLista: {
        marginBottom: 28,
        gap: 14,
    },

    metaLinha: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 8,
    },

    metaPonto: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Cores.destaque.limao,
        marginTop: 8,
    },

    metaCard: {
        flex: 1,
        borderRadius: 16,
        padding: 14,
    },

    metaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },

    metaIconeContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },

    metaIcone: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },

    metaNome: {
        flex: 1,
        fontFamily: FONTS.raleway.extrabold,
        fontSize: 17,
        color: Cores.destaque.limao,
    },

    metaData: {
        fontFamily: FONTS.quicksand.regular,
        fontSize: 13,
        color: '#C1A9E5',
        marginRight: 6,
    },

    metaMenu: {
        color: '#C1A9E5',
        fontSize: 16,
    },

    metaBarraFundo: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ffffff18',
        overflow: 'hidden',
        marginBottom: 8,
    },

    metaBarraPreenchida: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: Cores.roxo.claro,
    },

    metaFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    metaPrazo: {
        fontFamily: FONTS.quicksand.regular,
        fontSize: 12,
        color: '#BDA7E1',
    },

    metaValor: {
        fontFamily: FONTS.quicksand.regular,
        fontSize: 12,
        color: '#BDA7E1',
    },

    // ── METAS LONGO PRAZO ────────────────────────────────────
    longoPrazoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
    },

    longoPrazoCard: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },

    longoPrazoGradiente: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 12,
    },

    longoPrazoNome: {
        fontFamily: FONTS.quicksand.semibold,
        fontSize: 14,
        color: '#D8CDF7',
    },

    adicionarCard: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: '#3a2266',
        justifyContent: 'center',
        alignItems: 'center',
    },

    adicionarTexto: {
        fontSize: 32,
        color: '#8a6fc0',
        fontFamily: FONTS.quicksand.regular,
    },
})