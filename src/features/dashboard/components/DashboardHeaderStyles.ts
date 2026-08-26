import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 7,
    minHeight: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  identidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
    minWidth: 0,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 23,
    lineHeight: 25,
    color: Cores.destaque.limao,
  },
  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Cores.texto.principal,
    marginTop: 1,
  },
  icones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginLeft: 10,
  },
  botaoIcone: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
  },
})
