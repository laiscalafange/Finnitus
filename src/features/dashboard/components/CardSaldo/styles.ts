import { StyleSheet } from 'react-native'
import { FONTS } from '@/shared/constants/Tipografia'
import { Cores } from '@/shared/constants/Cores'

export const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 25,
    shadowColor: Cores.base.preto,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 6,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    lineHeight: 22,
    color: Cores.base.preto,
  },
  mes: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    lineHeight: 17,
    color: Cores.base.preto,
  },
  saldo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 29,
    lineHeight: 33,
    color: Cores.base.preto,
    marginTop: 1,
  },
  divisor: {
    marginVertical: 10,
  },
  label: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    lineHeight: 14,
    color: Cores.base.preto,
  },
  valorMes: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 21,
    lineHeight: 25,
    color: Cores.base.preto,
    marginTop: 5,
  },
  maximo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.base.preto,
    marginRight: 220,
  },
  linhaVariacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgePositivo: {
    backgroundColor: Cores.base.branco,
  },
  badgeNegativo: {
    backgroundColor: Cores.estado.erro,
  },
  badgeTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 10,
    lineHeight: 13,
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
  olho: { width: 25, height: 20, resizeMode: 'contain', marginLeft: 5, tintColor: Cores.base.preto,marginBottom:-10 },
  olhoMes: { width: 24, height: 18, resizeMode: 'contain', marginLeft: 5, tintColor: Cores.base.preto,marginBottom:-10  },
})
