import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  identidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    color: Cores.destaque.limao,
  },
  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 10,
    color: Cores.texto.principal,
    marginTop: 2,
  },
  icones: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  icone: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
})
