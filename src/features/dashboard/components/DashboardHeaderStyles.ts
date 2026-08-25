import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 10,
    minHeight: 58,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  identidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: Cores.destaque.limao,
    lineHeight: 25,
  },
  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.texto.principal,
    marginTop: 1,
  },
  icones: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  icone: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  },
})
