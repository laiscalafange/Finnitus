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
  // Header roxo (mesmo das outras telas) com a curva e a seta embaixo
  hero: {
    paddingBottom: 25,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'visible',
  },
  // Seta embaixo do header: toca pra esconder/mostrar Receitas e Despesas
  // (fica FORA do header, como no Dashboard, pra o toque funcionar no Android)
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
  // Texto de "nada por aqui ainda" dentro dos cards de lista
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