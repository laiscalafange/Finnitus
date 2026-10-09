
import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    minHeight: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Avatar e coroa
  avatarArea: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  coroaBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  coroaIcone: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  // Seletor do mês
  mes: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },

  mesTexto: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    lineHeight: 28,
    color: Cores.base.branco,
    flexShrink: 1,
  },

  // Sino sem círculo de fundo
  botaoSino: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sinoIcone: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: '#35106F',
  },
})
