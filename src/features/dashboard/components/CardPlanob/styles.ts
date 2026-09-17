import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },

  tituloLinha: {
    marginBottom: 15,
  },

  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 25,
    lineHeight: 26,
    color: Cores.destaque.limao,
  },

  corpo: {
    minHeight: 154,
    borderRadius: 7,
    backgroundColor: Cores.fundo.card,
    padding: 22,
  },

  navegacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    minHeight: 22,
  },

  navegacaoSeta: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 30,
    color: Cores.destaque.limao,
    lineHeight: 23,
    
    right: 10,
  },

  navegacaoTexto: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.destaque.limao,
    right: 38,
  },

  statusLabel: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.destaque.limao,
    textAlign: 'right',
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
    flex: 1,
  },

  gauge: {
    width: 118,
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  gaugeSvg: {
    position: 'absolute',
    left: 0,
    top: 0,
    transform: [{ rotate: '-90deg' }],
  },

  gaugeTexto: {
    position: 'absolute',
    alignItems: 'center',
    width: 104,
  },

  gaugeValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 15,
    lineHeight: 29,
    color: Cores.roxo.claro,
    textAlign: 'center',
  },

  gaugeLabel: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.texto.principal,
    textAlign: 'center',
    marginTop: 1,
  },

  categorias: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },

  categoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  categoriaIcone: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 15,
  },

  categoriaImagem: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    
  },

  categoriaTextos: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 0,
    
  },

  categoriaNome: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 16,
    color: Cores.texto.principal,
    flexShrink: 1,
  },

  categoriaValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.destaque.limao,
    
  },
})