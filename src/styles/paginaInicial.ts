
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
  setaContainer: {
    alignItems: 'center',
    marginTop: -1,
  },
  setaForma: {
    width: 79,
    height: 38,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    backgroundColor: Cores.fundo.seta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: {
    paddingTop: 14,
  },
  vazio: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 19,
    color: Cores.texto.claro,
    backgroundColor: 'rgba(72, 34, 135, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(163, 87, 255, 0.22)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
})
