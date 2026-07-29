import { StyleSheet } from 'react-native'
import { Cores } from '../../constants/Cores'
import { FONTS } from '../../constants/Tipografia'

export const styles = StyleSheet.create({
  botao: {
    position: 'absolute',
    bottom: 88,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Cores.roxo.principal,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Cores.roxo.principal,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  icone: {
    fontSize: 30,
    fontFamily: FONTS.raleway.bold,
    color: Cores.destaque.limao,
    lineHeight: 34,
  },
})