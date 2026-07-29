import { StyleSheet } from 'react-native'
import { Cores } from '../../constants/Cores'
import { FONTS } from '../../constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Cores.roxo.escuro,
    borderTopWidth: 1,
    borderTopColor: Cores.interface.borda,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  aba: {
    flex: 1,
    alignItems: 'center',
  },
  icone: {
    fontSize: 24,
    opacity: 0.4,
  },
  iconeAtivo: {
    opacity: 1,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Cores.roxo.principal,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    borderWidth: 4,
    borderColor: Cores.fundo.principal,
    elevation: 8,
  },
  fabIcone: {
    fontSize: 28,
    fontFamily: FONTS.raleway.bold,
    color: Cores.destaque.limao,
  },
})