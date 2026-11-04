import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 5,
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
    lineHeight: 40,
    color: Cores.destaque.limao,
    maxWidth: '100%',
  },
  descricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.claro,
  },
  olho: {
    marginTop: 5,
    padding: 2,
  },
})