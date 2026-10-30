import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
    header: {
        paddingTop: 62,
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

    // Calendário escondido: sem o espaço extra embaixo do título
    headerRowFechado: {
        marginBottom: 0,
    },

    headerTitulo: {
        fontFamily: FONTS.raleway.extrabold,
        fontSize: 28,
        color: Cores.destaque.limao,
        lineHeight: 30,
    },

    headerSubtitulo: {
        fontFamily: FONTS.quicksand.regular,
        fontSize: 20,
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

    // Dia comum (sem prazo de meta): fundo verde
    diaContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 6,
        paddingVertical: 13,
        borderRadius: 40,
        backgroundColor: Cores.destaque.limao,
        minHeight: 100,
        // Borda transparente: o dia selecionado ganha contorno sem mudar de tamanho
        borderWidth: 2,
        borderColor: 'transparent',
    },

    // Dia selecionado: contorno branco
    diaContainerAtivo: {
        borderColor: Cores.base.branco,
    },

    // Dia com prazo de meta: fundo roxo
    diaContainerMarcado: {
        backgroundColor: '#53269D',
    },

    // (o contorno do dia marcado e selecionado vem do diaContainerAtivo)
    diaContainerMarcadoAtivo: {
        borderColor: Cores.base.branco,
    },

    diaLetra: {
        fontFamily: FONTS.quicksand.bold,
        fontSize: 15,
        color: Cores.texto.contraste,
        marginBottom: 5,
    },

    diaNumero: {
        fontFamily: FONTS.raleway.bold,
        fontSize: 18,
        color: Cores.texto.contraste,
        marginBottom: 7,
    },

    diaPonto: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(59, 23, 107, 0.35)',
    },

    diaPontoAtivo: {
        backgroundColor: Cores.texto.contraste,
    },

    diaLetraMarcado: {
        color: '#D8CDF7',
    },

    diaNumeroMarcado: {
        color: '#B18AEF',
    },

    diaPontoMarcado: {
        backgroundColor: '#ffffff35',
    },

    setaContainer: {
        alignItems: 'center',
    },

    setaCirculo: {
        width: 79,
        height: 38,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        backgroundColor: Cores.fundo.seta,
        justifyContent: 'center',
        alignItems: 'center',
    },

    setaTexto: {
        color: Cores.base.branco,
        fontSize: 20,
    },
})