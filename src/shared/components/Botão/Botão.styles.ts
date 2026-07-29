import { StyleSheet } from 'react-native'
import { Cores } from '../../constants/Cores'
import { FONTS } from '../../constants/Tipografia'

export const styles = StyleSheet.create({
  botaoBase: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 52,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
  },
  textoBase: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
  },
})