import { StyleSheet } from 'react-native'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 14,
    marginBottom: 18,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 15,
    color: '#21102F',
  },
  mes: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 11,
    color: '#4C3D19',
  },
  saldo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 25,
    color: '#171B12',
    marginTop: 2,
  },
  divisor: {
    height: 1,
    backgroundColor: '#5C6D16',
    opacity: 0.35,
    marginVertical: 10,
  },
  label: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 9,
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
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#88BD00',
  },
  badgeTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 8,
    color: '#243000',
  },
})
