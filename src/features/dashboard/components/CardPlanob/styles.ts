import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginBottom: 18,
  },
  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 16,
    color: Cores.destaque.limao,
  },
  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 9,
    color: '#C4AFE4',
  },
  corpo: {
    minHeight: 124,
    borderRadius: 18,
    backgroundColor: '#32175E',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gauge: {
    width: 88,
    height: 88,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeTexto: {
    position: 'absolute',
    alignItems: 'center',
    width: 78,
  },
  gaugeValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 11,
    color: '#C0A3E8',
    textAlign: 'center',
  },
  gaugeLabel: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 8,
    color: '#A88ACF',
    marginTop: 1,
  },
  categorias: {
    flex: 1,
    gap: 6,
  },
  categoria: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoriaLinha: {
    width: 3,
    height: 25,
    borderRadius: 2,
    marginRight: 7,
  },
  categoriaTextos: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriaNome: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 9,
    color: '#D6C4ED',
  },
  categoriaValor: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 9,
    color: '#FFFFFF',
  },
})
