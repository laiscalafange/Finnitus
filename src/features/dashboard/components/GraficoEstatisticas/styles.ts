import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginBottom: 18,
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#3B1E63',
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 16,
    color: Cores.destaque.limao,
  },
  periodo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 9,
    color: '#D0C0E9',
  },
  grafico: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: '#281448',
    padding: 7,
  },
  dias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  dia: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 8,
    color: '#BDA7E1',
  },
  legenda: {
    alignItems: 'flex-end',
    gap: 3,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ponto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  pontoReceita: { backgroundColor: '#B7FF00' },
  pontoDespesa: { backgroundColor: '#FF8800' },
  legendaTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 7,
    color: '#D9C9EE',
  },
  verMais: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 9,
    color: Cores.destaque.limao,
    textAlign: 'right',
    marginTop: 8,
  },
  vazio: {
    padding: 18,
  },
  vazioTitulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: Cores.base.branco,
  },
  vazioTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 10,
    lineHeight: 15,
    color: '#BDA7E1',
    marginTop: 5,
  },
})
