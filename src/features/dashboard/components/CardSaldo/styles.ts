import { StyleSheet } from 'react-native'
import { FONTS } from '@/shared/constants/Tipografia'

import { Cores } from '@/shared/constants/Cores'
export const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 13,
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 17,
    shadowColor: Cores.base.preto,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 18,
    color: Cores.base.preto,
  },
  mes: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.base.preto,
  },
  saldo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 30,
    color: Cores.base.preto,
    marginTop: 1,
  },
  divisor: {
    height: 1,
    backgroundColor: Cores.interface.divisor,
    opacity: 0.35,
    marginVertical: 10,
  },
  label: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 11,
    color: Cores.base.preto,
  },
  valorMes: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 21,
    color: Cores.base.preto,
    marginTop: 1,
    marginBottom: 4,
  },
  maximo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.base.preto,
    marginLeft: 6,
  },
  linhaVariacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9,
  },
  badgePositivo: {
    backgroundColor: Cores.base.branco,
  },
  badgeNegativo: {
    backgroundColor: Cores.estado.erro,
  },
  badgeTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 11,
  },
  badgeTextoPositivo: {
    color: Cores.base.preto,
  },
  badgeTextoNegativo: {
    color: Cores.base.branco,
  },
})


export const extraStyles = StyleSheet.create({
  valorComIcone: { flexDirection: 'row', alignItems: 'center' },
  olho: { width: 16, height: 16, resizeMode: 'contain', marginLeft: 5, tintColor: Cores.base.preto },
  olhoMes: { width: 15, height: 15, resizeMode: 'contain', marginLeft: 5, tintColor: Cores.base.preto },
})
