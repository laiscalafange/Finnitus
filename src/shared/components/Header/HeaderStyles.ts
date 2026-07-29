import { StyleSheet } from 'react-native'
import { Cores } from '../../constants/Cores'
import { FONTS } from '../../constants/Tipografia'

export const styles = StyleSheet.create({
  interno: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 26,
    color: Cores.destaque.limao,
  },
  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: Cores.texto.principal,
    marginTop: 2,
  },
  icones: {
    flexDirection: 'row',
    gap: 16,
  },
  icone: {
    fontSize: 20,
    color: Cores.base.branco,
  },
})