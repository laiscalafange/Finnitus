import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 14,
  },
  label: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 18,
    lineHeight: 22,
    color: Cores.texto.claro,
  },
  saldo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 42,
    lineHeight: 50,
    color: Cores.base.branco,
    maxWidth: '100%',
  },
  descricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: Cores.texto.claro,
  },
  olho: {
    marginTop: 10,
    padding: 4,
  },
})