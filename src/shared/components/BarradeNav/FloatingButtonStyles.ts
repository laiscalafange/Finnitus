import { StyleSheet } from 'react-native'

import { Cores } from '../../constants/Cores'
import { FONTS } from '../../constants/Tipografia'

const FAB_R = 30
const BAR_H = 75

export const getStyles = (insetBottom: number) => StyleSheet.create({

  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BAR_H + 30 + insetBottom,
    alignItems: 'center',
    zIndex: 100,
    elevation: 20,
  },

  maskContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BAR_H + insetBottom,
    overflow: 'visible',
  },

  barra: {
    flex: 1,
    backgroundColor: Cores.fundo.navBarra,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  conteudo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: insetBottom,
    height: BAR_H,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  grupo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingBottom: 10,
  },

  aba: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 38,
  },

  icone: {
    width: 26,
    height: 26,
    opacity: 0.5,
  },

  iconeAtivo: {
    opacity: 1,
    tintColor: Cores.destaque.limao,
  },

  fab: {
    position: 'absolute',
    left: '49%',
    width: FAB_R * 2.3,
    height: FAB_R * 2.1,
    borderRadius: 100,
    transform: [{ translateX: -FAB_R }],
    bottom: BAR_H - FAB_R + insetBottom,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Cores.fundo.navFab,
    shadowColor: Cores.roxo.claro,
    shadowOpacity: 1,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 20 },
    elevation: 20,
    zIndex: 200,
  },

  fabIcone: {
    fontSize: 40,
    lineHeight: 40,
    fontFamily: FONTS.quicksand.regular,
    color: Cores.destaque.limao,
  },
})