import { StyleSheet } from 'react-native'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 13,
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 17,
    shadowColor: '#000000',
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
    fontSize: 14,
    color: '#21102F',
  },
  mes: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 11,
    color: '#4C3D19',
  },
  saldo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: '#171B12',
    marginTop: 1,
  },
  divisor: {
    height: 1,
    backgroundColor: '#5C6D16',
    opacity: 0.35,
    marginVertical: 10,
  },
  label: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 8,
    color: '#314113',
  },
  valorMes: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 17,
    color: '#171B12',
    marginTop: 1,
    marginBottom: 4,
  },
  maximo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 11,
    color: '#171B12',
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
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  badgeNegativo: {
    backgroundColor: '#7A1F1F',
  },
  badgeTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 8,
  },
  badgeTextoPositivo: {
    color: '#1E5E00',
  },
  badgeTextoNegativo: {
    color: '#FFD3D3',
  },
})


export const extraStyles = StyleSheet.create({
  valorComIcone: { flexDirection: 'row', alignItems: 'center' },
  olho: { width: 13, height: 13, resizeMode: 'contain', marginLeft: 5, tintColor: '#354611' },
  olhoMes: { width: 12, height: 12, resizeMode: 'contain', marginLeft: 5, tintColor: '#354611' },
})
