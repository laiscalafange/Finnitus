import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 18,
  },
  item: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bolha: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bolhaReceita: { backgroundColor: Cores.destaque.limao },
  bolhaDespesa: { backgroundColor: Cores.estado.erro },
  textos: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 16,
    lineHeight: 20,
    color: Cores.texto.claro,
  },
  valor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    lineHeight: 26,
  },
  valorReceita: { color: Cores.destaque.limao },
  valorDespesa: { color: Cores.base.branco },
})