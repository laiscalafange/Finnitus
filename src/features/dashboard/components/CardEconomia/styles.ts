import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },
  card: {
    minHeight: 112,
    borderRadius: 18,
    backgroundColor: '#3B1E63',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medidor: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 14,
  },
  medidorInterno: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#281448',
  },
  percentual: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.destaque.limao,
  },
  textos: {
    flex: 1,
  },
  destaque: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 14,
    color: Cores.destaque.limao,
  },
  destaqueAlerta: {
    color: '#FF6B4A',
  },
  descricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 8.5,
    lineHeight: 13,
    color: '#BDA7E1',
    marginTop: 5,
  },
})
