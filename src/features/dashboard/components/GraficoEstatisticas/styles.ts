import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 22,
    backgroundColor: Cores.fundo.card,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    lineHeight: 26,
    color: Cores.destaque.limao,
  },
  periodo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: Cores.texto.principal,
  },
  grafico: {
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: Cores.estado.desabilitado,
    padding: 10,
  },
  dias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 5,
  },
  dia: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 11,
    color: Cores.texto.principal,
  },
  legenda: {
    alignItems: 'flex-end',
    gap: 5,
    paddingTop: 1,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pontoReceita: { backgroundColor: Cores.destaque.limao },
  pontoDespesa: { backgroundColor: Cores.estado.perigo },
  legendaTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 10,
    color: Cores.texto.principal,
  },
  verMais: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: Cores.destaque.limao,
    textAlign: 'right',
    marginTop: 10,
  },
  vazio: {
    padding: 18,
  },
  vazioTitulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },
  vazioTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Cores.texto.principal,
    marginTop: 6,
  },
})
