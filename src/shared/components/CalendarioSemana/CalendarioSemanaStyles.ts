import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
    header: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 38,
        borderBottomRightRadius: 38,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },

    headerTitulo: {
        fontFamily: FONTS.raleway.extrabold,
        fontSize: 28,
        color: Cores.destaque.limao,
        lineHeight: 30,
    },

    headerSubtitulo: {
        fontFamily: FONTS.quicksand.regular,
        fontSize: 14,
        color: Cores.destaque.limao,
        marginTop: -1,
    },

    headerIcones: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        marginTop: 3,
    },

    icone: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },

    weekHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        marginTop: -5,
        marginBottom: 4,
    },

    weekMes: {
        color: Cores.base.branco,
        fontFamily: FONTS.quicksand.bold,
        fontSize: 13,
        textAlign: 'center',
    },

    weekArrow: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },

    weekArrowTexto: {
        color: Cores.destaque.limao,
        fontSize: 28,
        lineHeight: 30,
    },

    weekStrip: {
        flexDirection: 'row',
        gap: 7,
        marginHorizontal: -3,
    },

    diaContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 6,
        paddingVertical: 13,
        borderRadius: 40,
        backgroundColor: '#53269D',
        minHeight: 100,
    },

    diaContainerAtivo: {
        backgroundColor: '#3A1D6C',
    },

    diaLetra: {
        fontFamily: FONTS.quicksand.bold,
        fontSize: 15,
        color: '#D8CDF7',
        marginBottom: 5,
    },

    diaNumero: {
        fontFamily: FONTS.raleway.bold,
        fontSize: 18,
        color: '#B18AEF',
        marginBottom: 7,
    },

    diaPonto: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ffffff35',
    },

    diaPontoAtivo: {
        backgroundColor: Cores.destaque.limao,
    },

    setaContainer: {
        alignItems: 'center',
    },

    setaCirculo: {
        width: 79,
        height: 38,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        backgroundColor: '#330e6d',
        justifyContent: 'center',
        alignItems: 'center',
    },

    setaTexto: {
        color: '#00000000',
        fontSize: 20,
    },

    acoesRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },

    acaoBotao: {
        width: 35,
        height: 35,
        borderRadius: 17,
        backgroundColor: '#ffffff20',
        justifyContent: 'center',
        alignItems: 'center',
    },

    acaoTexto: {
        color: Cores.roxo.claro,
        fontSize: 18,
        fontFamily: FONTS.quicksand.bold,
    },

    acaoIcone: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
    },
})