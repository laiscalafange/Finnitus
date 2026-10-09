
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
    bottom: -38,
    left: 0,
    right: 0,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  heroCurvaForma: {
    width: 79,
    height: 38,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    backgroundColor: Cores.fundo.seta,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroCurvaSeta: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 20,
    lineHeight: 22,
    color: Cores.base.branco,
    marginTop: -3,
  },

  conteudo: {
    paddingTop: 39,
  },

  vazio: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 19,
    color: Cores.texto.principal,
    backgroundColor: Cores.fundo.card,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
})
