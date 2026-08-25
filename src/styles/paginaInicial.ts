import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.fundo.principal,
  },
  scroll: {
    flex: 1,
  },
  hero: {
    paddingBottom: 25,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'visible',
  },
  heroCurva: {
    position: 'absolute',
    bottom: -21,
    left: 0,
    right: 0,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCurvaForma: {
    width: 80,
    height: 42,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: Cores.roxo.escuro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCurvaSeta: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 25,
    lineHeight: 27,
    color: Cores.roxo.claro,
    marginTop: -5,
  },
  conteudo: {
    paddingTop: 39,
  },
})
