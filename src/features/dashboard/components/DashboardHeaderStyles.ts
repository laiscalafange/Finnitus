import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

// Largura dos dois lados do header (avatar e ícones) igual, pra o mês ficar
// exatamente no centro
const LADO = 76

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarArea: {
    width: LADO,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  // Seletor do mês no centro ("Outubro ⌄")
  mes: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mesTexto: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    lineHeight: 28,
    color: Cores.base.branco,
    flexShrink: 1,
  },

  // Coroa (Premium) e sino (notificações), como nas outras telas
  icones: {
    width: LADO,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 18,
  },
  icone: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
})