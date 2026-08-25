import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginBottom: 30,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },
  card: {
    minHeight: 125,
    borderRadius: 18,
    backgroundColor: '#32175E',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medidor: {
    width: 98,
    height: 98,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 14,
  },
  medidorInterno: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#281448',
  },
  percentual: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 21,
    color: Cores.destaque.limao,
  },
  textos: {
    flex: 1,
  },
  destaque: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 15,
    color: Cores.destaque.limao,
  },
  descricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 9,
    lineHeight: 14,
    color: '#BDA7E1',
    marginTop: 5,
  },
})
