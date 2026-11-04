
import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 20,
    marginTop: 2,
  },

  item: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,

    paddingHorizontal: 35,
    paddingVertical: 5,

  },

  bolha: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bolhaReceita: {
    backgroundColor: Cores.destaque.limao,
  },

  bolhaDespesa: {
    backgroundColor: 'rgba(187, 19, 19, 0.9)',
  },

  textos: {
    flex: 1,
    minWidth: 0,
  },

  rotuloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  label: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    lineHeight: 18,
    color: '#E4D2FF',
  },

  valor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 17,
    lineHeight: 23,
  },

  valorReceita: {
    color: Cores.base.branco,
  },

  valorDespesa: {
    color: Cores.base.branco,
  },
})
